const express = require("express");
const sql = require("sql.js");
const fs = require("fs");
const path = require("path");
const { DEFAULT_BEHAVIOR_RULES } = require("./src/config/behaviorRules");
const { SCORE_FIELDS } = require("./src/config/scoring");
const {
  calculateFinalScore,
  calculateGrade,
  calculateBonusRate,
  calculatePerformancePayout,
  calculateDefaultPerformancePayout,
  calculateCompositeScore,
} = require("./src/utils/scoringService");
const { classifySeverity, findBehaviorRule } = require("./src/utils/behaviorService");
const {
  validateEmployeePayload,
  validateScorePayload,
  validateBehaviorPayload,
} = require("./src/utils/validationService");

const PORT = process.env.PORT || process.env.RAILWAY_PORT || 3000;
const app = express();
app.use(express.json());

// Railway/Render 会提供 URL base
const BASE_URL = process.env.RAILWAY_STATIC_URL || process.env.BASE_URL || '';

let SQL;
let db;

function getDbPath() {
  return path.join(__dirname, "performance.db");
}

function saveDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(getDbPath(), buffer);
}

function backupDB() {
  const data = db.export();
  const buffer = Buffer.from(data);
  const backupPath = path.join(__dirname, `performance_backup_${new Date().toISOString().replace(/[:.]/g, '-')}.db`);
  fs.writeFileSync(backupPath, buffer);
  console.log(`数据库备份成功：${backupPath}`);
  return backupPath;
}

function initDB() {
  db = new SQL.Database();
  db.run(`
    CREATE TABLE employees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      department TEXT,
      team TEXT,
      position TEXT,
      base_salary REAL DEFAULT 0,
      performance TEXT,
      job_type TEXT DEFAULT 'developer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      period TEXT NOT NULL,
      task_completion REAL DEFAULT 0,
      task_quality REAL DEFAULT 0,
      work_efficiency REAL DEFAULT 0,
      performance_contribution REAL DEFAULT 0,
      responsibility REAL DEFAULT 0,
      teamwork REAL DEFAULT 0,
      initiative REAL DEFAULT 0,
      discipline REAL DEFAULT 0,
      professional_ethics REAL DEFAULT 0,
      communication REAL DEFAULT 0,
      innovation REAL DEFAULT 0,
      learning_ability REAL DEFAULT 0,
      self_score REAL,
      manager_score REAL,
      composite_score REAL,
      total_score REAL,
      grade TEXT,
      comment TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);

  db.run(`
    CREATE UNIQUE INDEX idx_scores_employee_period
    ON scores(employee_id, period)
  `);

  db.run(`
    CREATE TABLE behaviors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER,
      behavior_type TEXT,
      description TEXT,
      dimension TEXT,
      severity TEXT,
      score_impact INTEGER,
      count INTEGER DEFAULT 1,
      period TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id)
    )
  `);

  db.run(`
    CREATE INDEX idx_behaviors_employee_period
    ON behaviors(employee_id, period)
  `);

  db.run(`
    CREATE TABLE salary_structures (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_id INTEGER NOT NULL,
      basic_salary REAL DEFAULT 0,
      position_salary REAL DEFAULT 0,
      full_attendance_salary REAL DEFAULT 0,
      meal_allowance REAL DEFAULT 0,
      commute_allowance REAL DEFAULT 0,
      welfare_fund REAL DEFAULT 0,
      performance_base REAL DEFAULT 0,
      employment_status TEXT DEFAULT '正式工',
      position_level TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (employee_id) REFERENCES employees(id),
      UNIQUE(employee_id)
    )
  `);

  db.run(`
    CREATE TABLE behavior_rules (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      keywords TEXT,
      dimension TEXT,
      light_impact INTEGER,
      medium_impact INTEGER,
      heavy_impact INTEGER,
      is_positive INTEGER DEFAULT 0
    )
  `);

  // 创建用户表
  db.run(`
    CREATE TABLE users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 创建默认管理员用户（密码：admin123）
  db.run(
    "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
    ["admin", "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", "admin"]
  );

  const stmt = db.prepare(`
    INSERT INTO behavior_rules (
      name, keywords, dimension, light_impact, medium_impact, heavy_impact, is_positive
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `);
  DEFAULT_BEHAVIOR_RULES.forEach((rule) => stmt.run(rule));
  stmt.free();
  saveDB();
}

function ensureDbIndexes() {
  db.run(
    "CREATE UNIQUE INDEX IF NOT EXISTS idx_scores_employee_period ON scores(employee_id, period)"
  );
  db.run(
    "CREATE INDEX IF NOT EXISTS idx_behaviors_employee_period ON behaviors(employee_id, period)"
  );
}

function loadDB() {
  const dbPath = getDbPath();
  if (fs.existsSync(dbPath)) {
    db = new SQL.Database(fs.readFileSync(dbPath));
    ensureDbIndexes();
    
    // 检查并创建 users 表（如果不存在）
    try {
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT NOT NULL UNIQUE,
          password TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'user',
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);
      
      // 检查是否存在管理员用户，如果不存在则创建
      const result = db.exec("SELECT id FROM users WHERE username = 'admin'");
      if (!result[0]?.values?.length) {
        db.run(
          "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
          ["admin", "$2b$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW", "admin"]
        );
      }
    } catch (error) {
      console.error("创建 users 表时出错:", error);
    }
    
    saveDB();
  } else {
    initDB();
  }
}

function parseRows(resultSet, mapper) {
  return (resultSet[0]?.values || []).map(mapper);
}

function getBehaviorRules() {
  const result = db.exec("SELECT * FROM behavior_rules ORDER BY is_positive, name");
  return parseRows(result, (row) => ({
    id: row[0],
    name: row[1],
    keywords: String(row[2] || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    dimension: row[3],
    light_impact: row[4],
    medium_impact: row[5],
    heavy_impact: row[6],
    is_positive: row[7],
  }));
}

function calculateBehaviorImpact(employeeId, period) {
  const result = db.exec(
    `
    SELECT dimension, SUM(score_impact) as total_impact
    FROM behaviors
    WHERE employee_id = ? AND period = ?
    GROUP BY dimension
  `,
    [employeeId, period]
  );

  const impacts = {};
  let total = 0;
  parseRows(result, (row) => row).forEach((row) => {
    impacts[row[0]] = row[1];
    total += row[1];
  });
  return { dimensions: impacts, total };
}

function sendValidationError(res, errors) {
  return res.status(400).json({
    success: false,
    error: "VALIDATION_ERROR",
    message: errors.join("；"),
    details: errors,
  });
}

function handleApiError(res, error) {
  console.error(error);
  return res.status(500).json({
    success: false,
    error: "INTERNAL_ERROR",
    message: "服务内部错误，请稍后再试",
  });
}

function withApi(handler) {
  return (req, res) => {
    try {
      handler(req, res);
    } catch (error) {
      handleApiError(res, error);
    }
  };
}

app.get(
    "/api/employees",
    withApi((req, res) => {
      const result = db.exec("SELECT * FROM employees ORDER BY created_at DESC");
      res.json(
        parseRows(result, (row) => ({
          id: row[0],
          name: row[1],
          department: row[2],
          team: row[3],
          position: row[4],
          base_salary: row[5],
          performance: row[6],
          job_type: row[7],
          created_at: row[8],
        }))
      );
    })
  );

app.post(
    "/api/employees",
    withApi((req, res) => {
      const payload = {
        name: String(req.body.name || "").trim(),
        department: String(req.body.department || "").trim(),
        team: String(req.body.team || "").trim(),
        position: String(req.body.position || "").trim(),
        base_salary: Number(req.body.base_salary || 0),
        performance: String(req.body.performance || "").trim(),
        job_type: req.body.job_type || "developer",
      };
      const errors = validateEmployeePayload(payload);
      if (errors.length) return sendValidationError(res, errors);

      db.run("INSERT INTO employees (name, department, team, position, base_salary, performance, job_type) VALUES (?, ?, ?, ?, ?, ?, ?)", [
        payload.name,
        payload.department,
        payload.team,
        payload.position,
        payload.base_salary,
        payload.performance,
        payload.job_type,
      ]);
      saveDB();
      const id = db.exec("SELECT last_insert_rowid()")[0].values[0][0];
      res.json({ success: true, id });
    })
  );

app.delete(
  "/api/employees/:id",
  withApi((req, res) => {
    // 删除前备份数据库
    const backupPath = backupDB();
    
    const employeeId = Number(req.params.id);
    db.run("DELETE FROM employees WHERE id = ?", [employeeId]);
    db.run("DELETE FROM scores WHERE employee_id = ?", [employeeId]);
    db.run("DELETE FROM behaviors WHERE employee_id = ?", [employeeId]);
    db.run("DELETE FROM salary_structures WHERE employee_id = ?", [employeeId]);
    saveDB();
    res.json({ success: true, backup_path: backupPath });
  })
);

app.put(
  "/api/employees/:id",
  withApi((req, res) => {
    const employeeId = Number(req.params.id);
    if (isNaN(employeeId)) return sendValidationError(res, ["无效的员工ID"]);

    const payload = {
      name: String(req.body.name || "").trim(),
      department: String(req.body.department || "").trim(),
      team: String(req.body.team || "").trim(),
      position: String(req.body.position || "").trim(),
      base_salary: Number(req.body.base_salary || 0),
      performance: String(req.body.performance || "").trim(),
      job_type: req.body.job_type || "developer",
    };
    const errors = validateEmployeePayload(payload);
    if (errors.length) return sendValidationError(res, errors);

    db.run("UPDATE employees SET name = ?, department = ?, team = ?, position = ?, base_salary = ?, performance = ?, job_type = ? WHERE id = ?", [
      payload.name,
      payload.department,
      payload.team,
      payload.position,
      payload.base_salary,
      payload.performance,
      payload.job_type,
      employeeId
    ]);
    saveDB();
    res.json({ success: true });
  })
);

// 工资架构管理API
app.get(
  "/api/salary-structures",
  withApi((req, res) => {
    const result = db.exec(`
      SELECT ss.*, e.name as employee_name, e.department, e.position
      FROM salary_structures ss
      JOIN employees e ON ss.employee_id = e.id
      ORDER BY e.name
    `);
    res.json(
      parseRows(result, (row) => ({
        id: row[0],
        employee_id: row[1],
        basic_salary: row[2],
        position_salary: row[3],
        full_attendance_salary: row[4],
        meal_allowance: row[5],
        commute_allowance: row[6],
        welfare_fund: row[7],
        performance_base: row[8],
        employment_status: row[9],
        position_level: row[10],
        created_at: row[11],
        updated_at: row[12],
        employee_name: row[13],
        department: row[14],
        position: row[15],
      }))
    );
  })
);

app.get(
  "/api/salary-structures/:employeeId",
  withApi((req, res) => {
    const employeeId = Number(req.params.employeeId);
    if (isNaN(employeeId)) return sendValidationError(res, ["无效的员工ID"]);

    const result = db.exec(`
      SELECT * FROM salary_structures WHERE employee_id = ?
    `, [employeeId]);
    const structures = parseRows(result, (row) => ({
      id: row[0],
      employee_id: row[1],
      basic_salary: row[2],
      position_salary: row[3],
      full_attendance_salary: row[4],
      meal_allowance: row[5],
      commute_allowance: row[6],
      welfare_fund: row[7],
      performance_base: row[8],
      employment_status: row[9],
      position_level: row[10],
      created_at: row[11],
      updated_at: row[12],
    }));
    res.json(structures.length > 0 ? structures[0] : null);
  })
);

app.post(
  "/api/salary-structures",
  withApi((req, res) => {
    const payload = {
      employee_id: Number(req.body.employee_id),
      basic_salary: Number(req.body.basic_salary || 0),
      position_salary: Number(req.body.position_salary || 0),
      full_attendance_salary: Number(req.body.full_attendance_salary || 0),
      meal_allowance: Number(req.body.meal_allowance || 0),
      commute_allowance: Number(req.body.commute_allowance || 0),
      welfare_fund: Number(req.body.welfare_fund || 0),
      performance_base: Number(req.body.performance_base || 0),
      employment_status: String(req.body.employment_status || "正式工").trim(),
      position_level: String(req.body.position_level || "").trim(),
    };

    if (isNaN(payload.employee_id)) {
      return sendValidationError(res, ["无效的员工ID"]);
    }

    // 检查员工是否存在
    const employeeStmt = db.prepare(`SELECT id FROM employees WHERE id = ?`);
    employeeStmt.bind([payload.employee_id]);
    const employeeResult = [];
    while (employeeStmt.step()) {
      employeeResult.push(employeeStmt.get());
    }
    employeeStmt.free();
    if (employeeResult.length === 0) {
      return sendValidationError(res, ["员工不存在"]);
    }

    // 检查是否已存在工资架构
    const existingStmt = db.prepare(`SELECT id FROM salary_structures WHERE employee_id = ?`);
    existingStmt.bind([payload.employee_id]);
    const existingResult = [];
    while (existingStmt.step()) {
      existingResult.push(existingStmt.get());
    }
    existingStmt.free();
    if (existingResult.length > 0) {
      // 更新现有架构
      db.run(`
        UPDATE salary_structures SET 
          basic_salary = ?, 
          position_salary = ?, 
          full_attendance_salary = ?, 
          meal_allowance = ?, 
          commute_allowance = ?, 
          welfare_fund = ?, 
          performance_base = ?, 
          employment_status = ?, 
          position_level = ?, 
          updated_at = CURRENT_TIMESTAMP
        WHERE employee_id = ?
      `, [
        payload.basic_salary,
        payload.position_salary,
        payload.full_attendance_salary,
        payload.meal_allowance,
        payload.commute_allowance,
        payload.welfare_fund,
        payload.performance_base,
        payload.employment_status,
        payload.position_level,
        payload.employee_id
      ]);
    } else {
      // 创建新架构
      db.run(`
        INSERT INTO salary_structures (
          employee_id, basic_salary, position_salary, full_attendance_salary, 
          meal_allowance, commute_allowance, welfare_fund, performance_base, 
          employment_status, position_level
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        payload.employee_id,
        payload.basic_salary,
        payload.position_salary,
        payload.full_attendance_salary,
        payload.meal_allowance,
        payload.commute_allowance,
        payload.welfare_fund,
        payload.performance_base,
        payload.employment_status,
        payload.position_level
      ]);
    }

    saveDB();
    res.json({ success: true });
  })
);

app.delete(
  "/api/salary-structures/:id",
  withApi((req, res) => {
    const id = Number(req.params.id);
    if (isNaN(id)) return sendValidationError(res, ["无效的架构ID"]);

    db.run("DELETE FROM salary_structures WHERE id = ?", [id]);
    saveDB();
    res.json({ success: true });
  })
);

app.get(
  "/api/scores",
  withApi((req, res) => {
    const result = db.exec(`
      SELECT s.*, e.name as employee_name, e.department, e.position, e.job_type
      FROM scores s
      JOIN employees e ON s.employee_id = e.id
      ORDER BY s.created_at DESC
    `);

    res.json(
      parseRows(result, (row) => {
        const score = {
          id: row[0],
          employee_id: row[1],
          period: row[2],
          task_completion: row[3],
          task_quality: row[4],
          work_efficiency: row[5],
          performance_contribution: row[6],
          responsibility: row[7],
          teamwork: row[8],
          initiative: row[9],
          discipline: row[10],
          professional_ethics: row[11],
          communication: row[12],
          innovation: row[13],
          learning_ability: row[14],
          total_score: row[15],
          grade: row[16],
          comment: row[17],
          created_at: row[18],
          employee_name: row[19],
          department: row[20],
          position: row[21],
          job_type: row[22],
        };
        
        // 获取员工的绩效基数
        let performanceBase = 0;
        const salaryStructure = db.exec(
          "SELECT performance_base FROM salary_structures WHERE employee_id = ?",
          [score.employee_id]
        );
        if (salaryStructure[0]?.values?.[0]?.[0]) {
          performanceBase = salaryStructure[0].values[0][0] || 0;
        }
        
        // 获取员工的岗位和职级信息
        let position = "developer";
        let positionLevel = "5500";
        const employeeInfo = db.exec(
          "SELECT job_type, position FROM employees WHERE id = ?",
          [score.employee_id]
        );
        if (employeeInfo[0]?.values?.[0]?.[0]) {
          position = employeeInfo[0].values[0][0] || "developer";
        }
        if (employeeInfo[0]?.values?.[0]?.[1]) {
          positionLevel = employeeInfo[0].values[0][1] || "5500";
        }
        
        // 计算绩效系数和实发绩效金额
        const performanceResult = calculatePerformancePayout(performanceBase, score.total_score, positionLevel);
        score.coefficient = performanceResult["绩效系数"];
        score.actual_performance = performanceResult["实发绩效金额"];
        score.position = position;
        score.position_level = positionLevel;
        
        return score;
      })
    );
  })
);

app.post(
    "/api/scores",
    withApi((req, res) => {
      const payload = {
        employee_id: Number(req.body.employee_id),
        period: req.body.period,
        comment: String(req.body.comment || ""),
        self_score: Number(req.body.self_score),
        manager_score: Number(req.body.manager_score),
      };
      SCORE_FIELDS.forEach((field) => {
        payload[field] = Number(req.body[field]);
      });

      const errors = validateScorePayload(payload);
      if (errors.length) return sendValidationError(res, errors);

      // 获取员工的岗位信息
      let position = "developer";
      const employeeInfo = db.exec(
        "SELECT job_type FROM employees WHERE id = ?",
        [payload.employee_id]
      );
      if (employeeInfo[0]?.values?.[0]?.[0]) {
        position = employeeInfo[0].values[0][0] || "developer";
      }
      
      // 计算综合得分
      const compositeScore = calculateCompositeScore(payload.self_score, payload.manager_score);
      
      const behaviorImpact = calculateBehaviorImpact(payload.employee_id, payload.period);
      const totalScore = calculateFinalScore(payload, behaviorImpact.total, position);
      const grade = calculateGrade(totalScore);
      const bonusRate = calculateBonusRate(grade, totalScore);

      // 获取员工的绩效基数
      let performanceBase = 0;
      const salaryStructure = db.exec(
        "SELECT performance_base FROM salary_structures WHERE employee_id = ?",
        [payload.employee_id]
      );
      if (salaryStructure[0]?.values?.[0]?.[0]) {
        performanceBase = salaryStructure[0].values[0][0] || 0;
      }

      // 获取员工的职级信息
      let positionLevel = "5500";
      const employeePositionInfo = db.exec(
        "SELECT position FROM employees WHERE id = ?",
        [payload.employee_id]
      );
      if (employeePositionInfo[0]?.values?.[0]?.[0]) {
        positionLevel = employeePositionInfo[0].values[0][0] || "5500";
      }
      
      // 计算绩效系数和实发绩效金额
      const performanceResult = calculatePerformancePayout(performanceBase, totalScore, positionLevel);
      const coefficient = performanceResult["绩效系数"];
      const actualPerformance = performanceResult["实发绩效金额"];

      const existing = db.exec(
        "SELECT id FROM scores WHERE employee_id = ? AND period = ? LIMIT 1",
        [payload.employee_id, payload.period]
      );
      const existingId = existing[0]?.values?.[0]?.[0];

      if (existingId) {
        db.run(
          `
        UPDATE scores SET
          task_completion=?, task_quality=?, work_efficiency=?, performance_contribution=?,
          responsibility=?, teamwork=?, initiative=?,
          discipline=?, professional_ethics=?, communication=?,
          innovation=?, learning_ability=?, self_score=?, manager_score=?, composite_score=?,
          total_score=?, grade=?, comment=?, created_at=CURRENT_TIMESTAMP
        WHERE id=?
      `,
          [
            payload.task_completion,
            payload.task_quality,
            payload.work_efficiency,
            payload.performance_contribution,
            payload.responsibility,
            payload.teamwork,
            payload.initiative,
            payload.discipline,
            payload.professional_ethics,
            payload.communication,
            payload.innovation,
            payload.learning_ability,
            payload.self_score,
            payload.manager_score,
            compositeScore,
            totalScore,
            grade,
            payload.comment,
            existingId,
          ]
        );
      } else {
        db.run(
          `
        INSERT INTO scores (
          employee_id, period, task_completion, task_quality, work_efficiency, performance_contribution,
          responsibility, teamwork, initiative, discipline, professional_ethics, communication,
          innovation, learning_ability, self_score, manager_score, composite_score,
          total_score, grade, comment
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
          [
            payload.employee_id,
            payload.period,
            payload.task_completion,
            payload.task_quality,
            payload.work_efficiency,
            payload.performance_contribution,
            payload.responsibility,
            payload.teamwork,
            payload.initiative,
            payload.discipline,
            payload.professional_ethics,
            payload.communication,
            payload.innovation,
            payload.learning_ability,
            payload.self_score,
            payload.manager_score,
            compositeScore,
            totalScore,
            grade,
            payload.comment,
          ]
        );
      }

    saveDB();
    res.json({
      success: true,
      total_score: totalScore,
      grade,
      bonus_rate: bonusRate,
      coefficient,
      actual_performance: actualPerformance,
      behavior_impact: behaviorImpact,
      updated: Boolean(existingId),
    });
  })
);

app.delete(
  "/api/scores/:id",
  withApi((req, res) => {
    // 删除前备份数据库
    const backupPath = backupDB();
    
    db.run("DELETE FROM scores WHERE id = ?", [Number(req.params.id)]);
    saveDB();
    res.json({ success: true, backup_path: backupPath });
  })
);

// 薪资核算明细API
app.get(
  "/api/salary-details",
  withApi((req, res) => {
    const result = db.exec(`
      SELECT e.id as employee_id, e.name, e.department, e.position,
             ss.basic_salary, ss.position_salary, ss.full_attendance_salary,
             ss.meal_allowance, ss.commute_allowance, ss.welfare_fund,
             ss.performance_base, ss.employment_status, ss.position_level,
             s.total_score, s.grade
      FROM employees e
      LEFT JOIN salary_structures ss ON e.id = ss.employee_id
      LEFT JOIN (
        SELECT 
          s.employee_id, 
          s.total_score, 
          s.grade,
          ROW_NUMBER() OVER (PARTITION BY s.employee_id ORDER BY s.created_at DESC) as rn
        FROM scores s
      ) s ON e.id = s.employee_id AND s.rn = 1
      ORDER BY e.name
    `);
    
    const salaryDetails = parseRows(result, (row) => {
      // 计算实发薪资
      const actualSalary = (row[4] || 0) + // basic_salary
                         (row[5] || 0) + // position_salary
                         (row[6] || 0) + // full_attendance_salary
                         (row[7] || 0) + // meal_allowance
                         (row[8] || 0) + // commute_allowance
                         (row[9] || 0); // welfare_fund
      
      return {
        employee_id: row[0],
        name: row[1],
        department: row[2],
        position: row[3],
        basic_salary: row[4] || 0,
        position_salary: row[5] || 0,
        full_attendance_salary: row[6] || 0,
        meal_allowance: row[7] || 0,
        commute_allowance: row[8] || 0,
        welfare_fund: row[9] || 0,
        performance_base: row[10] || 0,
        employment_status: row[11],
        position_level: row[12],
        performance_score: row[13] || '-',
        performance_grade: row[14] || '-',
        performance_coefficient: '-',
        actual_performance: 0,
        actual_salary: actualSalary
      };
    });
    
    res.json(salaryDetails);
  })
);

app.get(
  "/api/behaviors",
  withApi((req, res) => {
    const result = db.exec(`
      SELECT b.*, e.name as employee_name
      FROM behaviors b
      JOIN employees e ON b.employee_id = e.id
      ORDER BY b.created_at DESC
    `);

    res.json(
      parseRows(result, (row) => ({
        id: row[0],
        employee_id: row[1],
        behavior_type: row[2],
        description: row[3],
        dimension: row[4],
        severity: row[5],
        score_impact: row[6],
        count: row[7],
        period: row[8],
        created_at: row[9],
        employee_name: row[10],
      }))
    );
  })
);

app.post(
  "/api/behaviors",
  withApi((req, res) => {
    const payload = {
      employee_id: Number(req.body.employee_id),
      description: String(req.body.description || "").trim(),
      count: Number(req.body.count || 1),
      period: req.body.period,
    };
    const errors = validateBehaviorPayload(payload);
    if (errors.length) return sendValidationError(res, errors);

    const severity = classifySeverity(payload.count);
    const rules = getBehaviorRules();
    const matchedRule = findBehaviorRule(payload.description, rules);

    if (!matchedRule) {
      db.run(
        `
        INSERT INTO behaviors (employee_id, behavior_type, description, dimension, severity, score_impact, count, period)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `,
        [
          payload.employee_id,
          "其他行为",
          payload.description,
          "other",
          severity,
          0,
          payload.count,
          payload.period,
        ]
      );
      saveDB();
      return res.json({
        success: true,
        behavior_type: "其他行为",
        dimension: "other",
        severity,
        score_impact: 0,
        message: `已记录：${payload.description || "其他行为"}，未关联维度`,
      });
    }

    const scoreImpact = matchedRule[`${severity}_impact`];
    db.run(
      `
      INSERT INTO behaviors (employee_id, behavior_type, description, dimension, severity, score_impact, count, period)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `,
      [
        payload.employee_id,
        matchedRule.name,
        payload.description,
        matchedRule.dimension,
        severity,
        scoreImpact,
        payload.count,
        payload.period,
      ]
    );

    saveDB();
    
    // 更新该员工的绩效数据
    const behaviorImpact = calculateBehaviorImpact(payload.employee_id, payload.period);
    
    // 查找该员工在该周期的评分记录
    const existingScores = db.exec(
      "SELECT id, total_score FROM scores WHERE employee_id = ? AND period = ?",
      [payload.employee_id, payload.period]
    );
    
    if (existingScores[0]?.values?.length > 0) {
      existingScores[0].values.forEach((scoreRow) => {
        const scoreId = scoreRow[0];
        const originalScore = scoreRow[1];
        const newTotalScore = Math.max(0, Math.min(100, originalScore + behaviorImpact.total));
        const newGrade = calculateGrade(newTotalScore);
        
        // 更新评分记录
        db.run(
          "UPDATE scores SET total_score = ?, grade = ? WHERE id = ?",
          [newTotalScore, newGrade, scoreId]
        );
      });
      saveDB();
    }

    res.json({
      success: true,
      behavior_type: matchedRule.name,
      dimension: matchedRule.dimension,
      severity,
      score_impact: scoreImpact,
      message: `已记录：${matchedRule.name}，${severity === "light" ? "轻微" : severity === "medium" ? "中等" : "严重"}，影响 ${
        scoreImpact > 0 ? "+" : ""
      }${scoreImpact} 分`,
    });
  })
);

app.delete(
  "/api/behaviors/:id",
  withApi((req, res) => {
    // 删除前备份数据库
    const backupPath = backupDB();
    
    const behaviorId = Number(req.params.id);
    
    // 先获取行为记录信息，以便后续更新绩效
    const behaviorInfo = db.exec(
      "SELECT employee_id, period FROM behaviors WHERE id = ?",
      [behaviorId]
    );
    
    if (behaviorInfo[0]?.values?.length > 0) {
      const [employeeId, period] = behaviorInfo[0].values[0];
      
      // 删除行为记录
      db.run("DELETE FROM behaviors WHERE id = ?", [behaviorId]);
      saveDB();
      
      // 更新该员工的绩效数据
      const behaviorImpact = calculateBehaviorImpact(employeeId, period);
      
      // 查找该员工在该周期的评分记录
      const existingScores = db.exec(
        "SELECT id, total_score FROM scores WHERE employee_id = ? AND period = ?",
        [employeeId, period]
      );
      
      if (existingScores[0]?.values?.length > 0) {
        existingScores[0].values.forEach((scoreRow) => {
          const scoreId = scoreRow[0];
          const originalScore = scoreRow[1];
          const newTotalScore = Math.max(0, Math.min(100, originalScore + behaviorImpact.total));
          const newGrade = calculateGrade(newTotalScore);
          
          // 更新评分记录
          db.run(
            "UPDATE scores SET total_score = ?, grade = ? WHERE id = ?",
            [newTotalScore, newGrade, scoreId]
          );
        });
        saveDB();
      }
    } else {
      // 如果行为记录不存在，直接删除
      db.run("DELETE FROM behaviors WHERE id = ?", [behaviorId]);
      saveDB();
    }
    
    res.json({ success: true, backup_path: backupPath });
  })
);

app.get(
  "/api/behavior-rules",
  withApi((req, res) => {
    res.json(getBehaviorRules());
  })
);

app.get(
  "/api/employees/:id/behavior-impact",
  withApi((req, res) => {
    const period = req.query.period;
    const impact = calculateBehaviorImpact(Number(req.params.id), period);
    res.json(impact);
  })
);

app.get(
  "/api/export",
  withApi((req, res) => {
    const employees = db.exec("SELECT * FROM employees")[0]?.values || [];
    const scores = db.exec(`
      SELECT s.*, e.name as employee_name, e.department
      FROM scores s
      JOIN employees e ON s.employee_id = e.id
    `)[0]?.values || [];
    const behaviors = db.exec(`
      SELECT b.*, e.name as employee_name
      FROM behaviors b
      JOIN employees e ON b.employee_id = e.id
    `)[0]?.values || [];
    res.json({ employees, scores, behaviors });
  })
);

// 用户认证和权限管理 API
app.post(
  "/api/auth/login",
  withApi((req, res) => {
    const { username, password } = req.body;
    
    // 简单的密码验证（实际项目中应该使用 bcrypt 等库进行密码哈希验证）
    const result = db.exec(
      "SELECT id, username, role FROM users WHERE username = ? AND password = ?",
      [username, password]
    );
    
    if (result[0]?.values?.length > 0) {
      const user = result[0].values[0];
      res.json({
        success: true,
        user: {
          id: user[0],
          username: user[1],
          role: user[2]
        }
      });
    } else {
      res.json({
        success: false,
        message: "用户名或密码错误"
      });
    }
  })
);

app.post(
  "/api/auth/register",
  withApi((req, res) => {
    const { username, password, role } = req.body;
    
    try {
      db.run(
        "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
        [username, password, role || "user"]
      );
      saveDB();
      res.json({ success: true });
    } catch (error) {
      res.json({
        success: false,
        message: "用户名已存在"
      });
    }
  })
);

app.get(
  "/api/users",
  withApi((req, res) => {
    const result = db.exec("SELECT id, username, role, created_at FROM users");
    res.json(
      parseRows(result, (row) => ({
        id: row[0],
        username: row[1],
        role: row[2],
        created_at: row[3]
      }))
    );
  })
);

// 配置静态文件服务
app.use(express.static('public'));

// 配置前端路由，处理单页应用的路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

sql().then((sqlInstance) => {
  SQL = sqlInstance;
  loadDB();
  const PORT = 3000;
  app.listen(PORT, () => {
    console.log(`绩效考核系统运行在 http://localhost:${PORT}`);
  });
});
