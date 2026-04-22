// 绩效考核管理系统前端应用

// 数据存储
let employees = [];
let scores = [];
let behaviors = [];
let behaviorRules = [];
let salaryStructures = [];

// 初始化数据
function initData() {
  // 从本地存储加载数据
  employees = JSON.parse(localStorage.getItem('employees')) || [];
  scores = JSON.parse(localStorage.getItem('scores')) || [];
  behaviors = JSON.parse(localStorage.getItem('behaviors')) || [];
  behaviorRules = JSON.parse(localStorage.getItem('behaviorRules')) || [];
  salaryStructures = JSON.parse(localStorage.getItem('salaryStructures')) || [];
  
  // 如果没有数据，初始化默认数据
  if (employees.length === 0) {
    initDefaultData();
  }
  
  // 保存到本地存储
  saveData();
}

// 初始化默认数据
function initDefaultData() {
  // 员工数据
  employees = [
    { id: 1, name: "姚春龙", department: "技术部", position: "后端工程师", base_salary: 2360, performance: 2500, job_type: "developer" },
    { id: 2, name: "李帆", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 3500, job_type: "developer" },
    { id: 3, name: "张佳宜", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 2500, job_type: "developer" },
    { id: 4, name: "李雯艺", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 1430, job_type: "developer" },
    { id: 5, name: "谢宛容", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 1930, job_type: "developer" },
    { id: 6, name: "陈丹诗", department: "设计部", position: "设计", base_salary: 2360, performance: 3600, job_type: "developer" },
    { id: 7, name: "胡利函", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 1430, job_type: "developer" },
    { id: 8, name: "张永安", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 5500, job_type: "developer" },
    { id: 9, name: "何晶晶", department: "人事部", position: "人事", base_salary: 2360, performance: 2500, job_type: "developer" },
    { id: 10, name: "高燕梅", department: "技术部", position: "测试", base_salary: 2360, performance: 1430, job_type: "developer" },
    { id: 11, name: "薛瑜曼", department: "技术部", position: "前端工程师", base_salary: 2360, performance: 1430, job_type: "developer" },
    { id: 12, name: "吴子豪", department: "技术部", position: "后端工程师", base_salary: 1000, performance: 7000, job_type: "developer" },
    { id: 13, name: "陈洁儿", department: "技术部", position: "测试", base_salary: 2360, performance: 1930, job_type: "developer" },
    { id: 14, name: "汪海源", department: "技术部", position: "后端工程师", base_salary: 2360, performance: 2500, job_type: "developer" },
    { id: 15, name: "王建鑫", department: "技术部", position: "前端工程师", base_salary: 0, performance: 5000, job_type: "developer" },
    { id: 16, name: "刘勇", department: "技术部", position: "前端工程师", base_salary: 0, performance: 4000, job_type: "developer" },
    { id: 17, name: "潘勇", department: "技术部", position: "前端工程师", base_salary: 0, performance: 6000, job_type: "developer" },
    { id: 18, name: "林诗彤", department: "技术部", position: "前端工程师", base_salary: 0, performance: 6000, job_type: "developer" },
    { id: 19, name: "方祥楷", department: "技术部", position: "运维", base_salary: 0, performance: 6000, job_type: "developer" }
  ];
  
  // 薪资结构数据
  salaryStructures = [
    { employee_id: 1, basic_salary: 2360, position_salary: 1000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 1140, performance_base: 2500, employment_status: "正式工", position_level: "L1" },
    { employee_id: 2, basic_salary: 2360, position_salary: 1500, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 1140, performance_base: 3500, employment_status: "正式工", position_level: "L2" },
    { employee_id: 3, basic_salary: 2360, position_salary: 1000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 1140, performance_base: 2500, employment_status: "正式工", position_level: "L1" },
    { employee_id: 4, basic_salary: 2360, position_salary: 500, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 710, performance_base: 1430, employment_status: "正式工", position_level: "L5" },
    { employee_id: 5, basic_salary: 2360, position_salary: 1000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 710, performance_base: 1930, employment_status: "正式工", position_level: "L2" },
    { employee_id: 6, basic_salary: 2360, position_salary: 1500, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 1540, performance_base: 3600, employment_status: "正式工", position_level: "L1" },
    { employee_id: 7, basic_salary: 2360, position_salary: 500, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 710, performance_base: 1430, employment_status: "正式工", position_level: "L1" },
    { employee_id: 8, basic_salary: 2360, position_salary: 3000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 2140, performance_base: 5500, employment_status: "正式工", position_level: "L2" },
    { employee_id: 9, basic_salary: 2360, position_salary: 1000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 1140, performance_base: 2500, employment_status: "正式工", position_level: "L1" },
    { employee_id: 10, basic_salary: 2360, position_salary: 500, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 710, performance_base: 1430, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 11, basic_salary: 2360, position_salary: 500, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 710, performance_base: 1430, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 12, basic_salary: 1000, position_salary: 100, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 710, welfare_fund: 1930, performance_base: 7000, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 13, basic_salary: 2360, position_salary: 1000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 710, performance_base: 1930, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 14, basic_salary: 2360, position_salary: 1000, full_attendance_salary: 300, meal_allowance: 300, commute_allowance: 300, welfare_fund: 1140, performance_base: 2500, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 15, basic_salary: 0, position_salary: 0, full_attendance_salary: 0, meal_allowance: 0, commute_allowance: 0, welfare_fund: 0, performance_base: 5000, employment_status: "实习期", position_level: "未设置" },
    { employee_id: 16, basic_salary: 0, position_salary: 0, full_attendance_salary: 0, meal_allowance: 0, commute_allowance: 0, welfare_fund: 0, performance_base: 4000, employment_status: "实习期", position_level: "未设置" },
    { employee_id: 17, basic_salary: 0, position_salary: 0, full_attendance_salary: 0, meal_allowance: 0, commute_allowance: 0, welfare_fund: 0, performance_base: 6000, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 18, basic_salary: 0, position_salary: 0, full_attendance_salary: 0, meal_allowance: 0, commute_allowance: 0, welfare_fund: 0, performance_base: 6000, employment_status: "正式工", position_level: "未设置" },
    { employee_id: 19, basic_salary: 0, position_salary: 0, full_attendance_salary: 0, meal_allowance: 0, commute_allowance: 0, welfare_fund: 0, performance_base: 6000, employment_status: "正式工", position_level: "未设置" }
  ];
  
  // 行为规则
  behaviorRules = [
    { keyword: "迟到", type: "negative", dimension: "纪律性", severity: "light", score: -1 },
    { keyword: "早退", type: "negative", dimension: "纪律性", severity: "light", score: -1 },
    { keyword: "旷工", type: "negative", dimension: "纪律性", severity: "heavy", score: -5 },
    { keyword: "延期", type: "negative", dimension: "任务完成", severity: "medium", score: -2 },
    { keyword: "质量差", type: "negative", dimension: "任务质量", severity: "medium", score: -2 },
    { keyword: "冲突", type: "negative", dimension: "团队协作", severity: "medium", score: -2 },
    { keyword: "加班", type: "positive", dimension: "责任心", severity: "light", score: 1 },
    { keyword: "提前", type: "positive", dimension: "工作效率", severity: "light", score: 1 },
    { keyword: "创新", type: "positive", dimension: "创新能力", severity: "medium", score: 2 },
    { keyword: "协助", type: "positive", dimension: "团队协作", severity: "light", score: 1 },
    { keyword: "表彰", type: "positive", dimension: "业绩贡献", severity: "medium", score: 2 }
  ];
}

// 保存数据到本地存储
function saveData() {
  localStorage.setItem('employees', JSON.stringify(employees));
  localStorage.setItem('scores', JSON.stringify(scores));
  localStorage.setItem('behaviors', JSON.stringify(behaviors));
  localStorage.setItem('behaviorRules', JSON.stringify(behaviorRules));
  localStorage.setItem('salaryStructures', JSON.stringify(salaryStructures));
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
  initData();
  loadOverview();
  updateEmployeeCards();
  updateBehaviorList();
  updateScoreList();
  loadRanking();
  loadSalaryDetails();
});

// 显示标签页
function showTab(tab, event) {
  document.querySelectorAll('[id$="-tab"]').forEach(el => el.style.display = 'none');
  document.getElementById(tab + '-tab').style.display = 'block';
  document.querySelectorAll('.tab').forEach(el => el.classList.remove('active'));
  if (event && event.target) {
    event.target.classList.add('active');
  }
  
  if (tab === 'ranking') loadRanking();
  if (tab === 'overview') loadOverview();
  if (tab === 'behaviors') updateBehaviorList();
  if (tab === 'salary') loadSalaryDetails();
}

// 加载概览数据
function loadOverview() {
  // 确保所有DOM元素存在
  const totalEmployees = document.getElementById('total-employees');
  const totalScores = document.getElementById('total-scores');
  const totalBehaviors = document.getElementById('total-behaviors');
  const statEmployees = document.getElementById('stat-employees');
  const statBehaviors = document.getElementById('stat-behaviors');
  const statAvg = document.getElementById('stat-avg');
  const statExcellent = document.getElementById('stat-excellent');
  const recentBehaviorsEl = document.getElementById('recent-behaviors');
  const recentScoresList = document.getElementById('recent-scores-list');
  
  if (!totalEmployees || !totalScores || !totalBehaviors || !statEmployees || !statBehaviors || !statAvg || !statExcellent || !recentBehaviorsEl || !recentScoresList) {
    return;
  }
  
  totalEmployees.textContent = employees.length;
  totalScores.textContent = scores.length;
  totalBehaviors.textContent = behaviors.length;
  
  statEmployees.textContent = employees.length;
  statBehaviors.textContent = behaviors.filter(b => {
    const behaviorDate = new Date(b.created_at);
    const now = new Date();
    return behaviorDate.getMonth() === now.getMonth() && behaviorDate.getFullYear() === now.getFullYear();
  }).length;
  
  if (scores.length > 0) {
    const avgScore = scores.reduce((sum, s) => sum + s.total_score, 0) / scores.length;
    statAvg.textContent = avgScore.toFixed(1);
  } else {
    statAvg.textContent = '-';
  }
  
  const excellentCount = scores.filter(s => s.grade === 'A' || s.grade === 'A+').length;
  statExcellent.textContent = excellentCount;
  
  // 加载近期行为记录
  const recentBehaviors = behaviors.slice(-5).reverse();
  recentBehaviorsEl.innerHTML = recentBehaviors.map(b => {
    const employee = employees.find(e => e.id === b.employee_id);
    return `
      <tr>
        <td>${employee?.name || '未知'}</td>
        <td>${b.description}</td>
        <td>${b.dimension}</td>
        <td style="color: ${b.type === 'positive' ? 'green' : 'red'}">${b.score > 0 ? '+' : ''}${b.score}</td>
      </tr>
    `; 
  }).join('');
  
  // 加载近期考核
  const recentScores = scores.slice(-5).reverse();
  recentScoresList.innerHTML = recentScores.map(s => {
    const employee = employees.find(e => e.id === s.employee_id);
    return `
      <div class="score-item">
        <div class="score-item-header">
          <span class="score-item-employee">${employee?.name || '未知'}</span>
          <span class="score-item-period">${s.period}</span>
        </div>
        <div class="score-item-body">
          <div class="score-item-score">${s.total_score.toFixed(1)}</div>
          <div class="score-item-grade">${s.grade}</div>
          <div class="score-item-comment">${s.comment || '无'}</div>
        </div>
      </div>
    `;
  }).join('');
}

// 更新员工表格
function updateEmployeeCards() {
  const employeeList = document.getElementById('employee-list');
  const employeeCount = document.getElementById('employee-count');
  
  // 确保元素存在
  if (!employeeList || !employeeCount) {
    return;
  }
  
  employeeCount.textContent = `共 ${employees.length} 人`;
  
  if (employees.length === 0) {
    employeeList.innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--gray-500); padding: 40px;">暂无员工数据</td></tr>';
    return;
  }
  
  // 按姓名拼音排序
  const sortedEmployees = [...employees].sort((a, b) => a.name.localeCompare(b.name));
  
  // 如果需要按员工编号排序，使用下面的代码
  // const sortedEmployees = [...employees].sort((a, b) => a.id - b.id);
  
  employeeList.innerHTML = sortedEmployees.map(emp => {
    const salaryStructure = salaryStructures.find(ss => ss.employee_id === emp.id);
    const latestScore = scores.filter(s => s.employee_id === emp.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    // 计算实发绩效
    let actualPerformance = 0;
    let performanceCoefficient = 1.0;
    let performanceScore = '-';
    let selfScore = '-';
    let managerScore = '-';
    let compositeScore = '-';
    let grade = 'B（默认）';
    let gradeClass = 'grade-B';
    
    if (salaryStructure) {
      // 获取员工的岗位和职级信息
      const position = emp.job_type || "developer";
      const positionLevel = emp.position || "5500";
      
      if (latestScore) {
        // 计算绩效系数
        if (latestScore.total_score >= 95) {
          performanceCoefficient = 1.5;
          grade = 'A+';
          gradeClass = 'grade-A-plus';
        } else if (latestScore.total_score >= 90) {
          performanceCoefficient = 1.3;
          grade = 'A';
          gradeClass = 'grade-A';
        } else if (latestScore.total_score >= 80) {
          performanceCoefficient = 1.1;
          grade = 'B+';
          gradeClass = 'grade-B-plus';
        } else if (latestScore.total_score >= 70) {
          performanceCoefficient = 1.0;
          grade = 'B';
          gradeClass = 'grade-B';
        } else if (latestScore.total_score >= 60) {
          performanceCoefficient = 0.5;
          grade = 'C';
          gradeClass = 'grade-C';
        } else {
          performanceCoefficient = 0.2;
          grade = 'D';
          gradeClass = 'grade-D';
        }
        
        const performanceResult = calculatePerformancePayout(salaryStructure.performance_base, latestScore.total_score, positionLevel);
        actualPerformance = performanceResult["实发绩效金额"];
        performanceScore = latestScore.total_score.toFixed(1);
        selfScore = latestScore.self_score ? latestScore.self_score.toFixed(1) : '-';
        managerScore = latestScore.manager_score ? latestScore.manager_score.toFixed(1) : '-';
        compositeScore = latestScore.composite_score ? latestScore.composite_score.toFixed(1) : '-';
      } else {
        // 未评分时默认等级B，系数1.0
        const performanceResult = calculateDefaultPerformancePayout(salaryStructure.performance_base, positionLevel);
        actualPerformance = performanceResult["实发绩效金额"];
        performanceCoefficient = performanceResult["绩效系数"];
      }
    }
    
    return `
      <tr>
        <td>${emp.name}</td>
        <td>${emp.department || '未分配'}</td>
        <td>${emp.position || '未设置'}</td>
        <td class="text-right">${salaryStructure?.performance_base || 0}</td>
        <td class="text-right">${selfScore}</td>
        <td class="text-right">${managerScore}</td>
        <td class="text-right">${compositeScore}</td>
        <td><span class="${gradeClass}">${grade}</span></td>
        <td class="text-right">${performanceCoefficient}</td>
        <td class="text-right">${actualPerformance.toFixed(2)}</td>
        <td>
          <div class="action-buttons">
            <button class="btn btn-edit" onclick="openEditEmployeeModal(${emp.id})"><i class="fas fa-edit"></i> 编辑</button>
            <button class="btn btn-delete" onclick="confirmDeleteEmployee(${emp.id})"><i class="fas fa-trash"></i> 删除</button>
            <button class="btn btn-view" onclick="viewSalaryDetails(${emp.id})"><i class="fas fa-eye"></i> 查看薪资</button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

// 打开添加员工弹窗
function openAddEmployeeModal() {
  document.getElementById('add-employee-modal').style.display = 'block';
}

// 关闭添加员工弹窗
function closeAddEmployeeModal() {
  document.getElementById('add-employee-modal').style.display = 'none';
  // 清空表单
  document.getElementById('emp-name').value = '';
  document.getElementById('emp-dept').value = '';
  document.getElementById('emp-team').value = '';
  document.getElementById('emp-pos').value = '';
  document.getElementById('emp-base-salary').value = '0';
  document.getElementById('emp-performance').value = '';
  document.getElementById('emp-type').value = 'developer';
}

// 添加员工
function addEmployee() {
  const name = document.getElementById('emp-name').value;
  if (!name) {
    alert('请输入员工姓名');
    return;
  }
  
  const newEmployee = {
    id: employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1,
    name: name,
    department: document.getElementById('emp-dept').value,
    team: document.getElementById('emp-team').value,
    position: document.getElementById('emp-pos').value,
    base_salary: Number(document.getElementById('emp-base-salary').value),
    performance: document.getElementById('emp-performance').value,
    job_type: document.getElementById('emp-type').value
  };
  
  employees.push(newEmployee);
  
  // 添加默认薪资结构
  const newSalaryStructure = {
    employee_id: newEmployee.id,
    basic_salary: newEmployee.base_salary,
    position_salary: 0,
    full_attendance_salary: 0,
    meal_allowance: 0,
    commute_allowance: 0,
    welfare_fund: 0,
    performance_base: Number(newEmployee.performance) || 0,
    employment_status: '正式工',
    position_level: '未设置'
  };
  
  salaryStructures.push(newSalaryStructure);
  
  // 初始化新员工的绩效数据
  // 注意：这里不需要添加评分记录，因为评分是需要手动进行的
  // 系统会在计算绩效时自动使用默认值
  
  saveData();
  updateEmployeeCards();
  loadOverview();
  loadSalaryDetails(); // 确保新员工显示在薪资核算明细中
  closeAddEmployeeModal();
  alert('员工添加成功！');
}

// 打开编辑员工弹窗
function openEditEmployeeModal(employeeId) {
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return;
  
  document.getElementById('edit-emp-id').value = employee.id;
  document.getElementById('edit-emp-name').value = employee.name;
  document.getElementById('edit-emp-dept').value = employee.department;
  document.getElementById('edit-emp-team').value = employee.team;
  document.getElementById('edit-emp-pos').value = employee.position;
  document.getElementById('edit-emp-base-salary').value = employee.base_salary;
  document.getElementById('edit-emp-performance').value = employee.performance;
  document.getElementById('edit-emp-type').value = employee.job_type;
  
  document.getElementById('edit-employee-modal').style.display = 'block';
}

// 关闭编辑员工弹窗
function closeEditEmployeeModal() {
  document.getElementById('edit-employee-modal').style.display = 'none';
}

// 保存员工编辑
function saveEmployee() {
  const id = Number(document.getElementById('edit-emp-id').value);
  const employee = employees.find(e => e.id === id);
  if (!employee) return;
  
  employee.name = document.getElementById('edit-emp-name').value;
  employee.department = document.getElementById('edit-emp-dept').value;
  employee.team = document.getElementById('edit-emp-team').value;
  employee.position = document.getElementById('edit-emp-pos').value;
  employee.base_salary = Number(document.getElementById('edit-emp-base-salary').value);
  employee.performance = document.getElementById('edit-emp-performance').value;
  employee.job_type = document.getElementById('edit-emp-type').value;
  
  // 更新薪资结构
  const salaryStructure = salaryStructures.find(ss => ss.employee_id === id);
  if (salaryStructure) {
    salaryStructure.basic_salary = employee.base_salary;
    salaryStructure.performance_base = Number(employee.performance) || 0;
  }
  
  saveData();
  updateEmployeeCards();
  loadOverview();
  closeEditEmployeeModal();
  alert('员工更新成功！');
}

// 确认删除员工
function confirmDeleteEmployee(employeeId) {
  const employee = employees.find(e => e.id === employeeId);
  if (!employee) return;
  
  document.getElementById('delete-message').textContent = `确定要删除员工 "${employee.name}" 吗？`;
  const deleteModal = document.getElementById('delete-modal');
  deleteModal.style.display = 'flex';
  deleteModal.classList.add('active');
  document.getElementById('confirm-delete-btn').onclick = () => {
    deleteEmployee(employeeId);
    closeModal();
  };
}

// 删除员工
function deleteEmployee(employeeId) {
  // 直接在本地删除员工数据
  // 删除员工本身
  employees = employees.filter(e => e.id !== employeeId);
  // 删除该员工的所有评分记录
  scores = scores.filter(s => s.employee_id !== employeeId);
  // 删除该员工的所有行为记录
  behaviors = behaviors.filter(b => b.employee_id !== employeeId);
  // 删除该员工的薪资结构
  salaryStructures = salaryStructures.filter(ss => ss.employee_id !== employeeId);
  
  saveData();
  
  // 刷新所有相关页面
  updateEmployeeCards();
  loadOverview();
  updateBehaviorList();
  updateScoreList();
  loadRanking();
  loadSalaryDetails();
  
  alert('员工删除成功！');
}

// 关闭弹窗
function closeModal() {
  const deleteModal = document.getElementById('delete-modal');
  deleteModal.style.display = 'none';
  deleteModal.classList.remove('active');
}

// 预览行为
// 导入行为事件配置
let BEHAVIOR_EVENTS = {
  negative: [],
  positive: []
};
let SEVERITY_LEVELS = {
  light: '轻微',
  medium: '一般',
  heavy: '严重',
  major: '重大'
};

// 职级绩效参数
const POSITION_LEVEL_PERFORMANCE = {
  "5500": {
    base: 1500,
    min: 300,
    max: 2250,
    normal: 1350
  },
  "7000": {
    base: 2300,
    min: 460,
    max: 3450,
    normal: 2070
  },
  "9000": {
    base: 3200,
    min: 640,
    max: 4800,
    normal: 2880
  }
};

// 计算绩效实发金额
function calculatePerformancePayout(performanceBase, score, positionLevel = "5500") {
  // 绩效基数为0时，实发绩效固定为0
  if (performanceBase === 0) {
    return {
      "绩效基数": 0,
      "绩效得分": 0,
      "绩效等级": "B",
      "绩效系数": 1.0,
      "实发绩效金额": 0
    };
  }
  
  let coefficient, level;
  
  const safeScore = Math.max(0, Math.min(100, Number(score) || 0));
  
  if (safeScore >= 95) {
    coefficient = 1.5;
    level = "A+";
  } else if (safeScore >= 90) {
    coefficient = 1.3;
    level = "A";
  } else if (safeScore >= 80) {
    coefficient = 1.1;
    level = "B+";
  } else if (safeScore >= 70) {
    coefficient = 1.0;
    level = "B";
  } else if (safeScore >= 60) {
    coefficient = 0.5;
    level = "C";
  } else {
    coefficient = 0.2;
    level = "D";
  }

  // 获取职级绩效参数
  const performanceParams = POSITION_LEVEL_PERFORMANCE[positionLevel] || POSITION_LEVEL_PERFORMANCE["5500"];
  
  let actualPerformance = Math.round(performanceBase * coefficient * 100) / 100;
  
  // 绩效区间限制：按职级的最低/最高执行
  actualPerformance = Math.max(performanceParams.min, Math.min(performanceParams.max, actualPerformance));

  return {
    "绩效基数": performanceBase,
    "绩效得分": safeScore,
    "绩效等级": level,
    "绩效系数": Math.round(coefficient * 1000) / 1000,
    "实发绩效金额": actualPerformance,
    "绩效最低": performanceParams.min,
    "绩效最高": performanceParams.max,
    "正常绩效": performanceParams.normal
  };
}

// 计算默认绩效实发金额
function calculateDefaultPerformancePayout(performanceBase, positionLevel = "5500") {
  // 绩效基数为0时，实发绩效固定为0
  if (performanceBase === 0) {
    return {
      "绩效基数": 0,
      "绩效得分": 0,
      "绩效等级": "B",
      "绩效系数": 1.0,
      "实发绩效金额": 0
    };
  }
  
  // 未评分时默认值
  const coefficient = 1.0;
  const level = "B";
  
  // 获取职级绩效参数
  const performanceParams = POSITION_LEVEL_PERFORMANCE[positionLevel] || POSITION_LEVEL_PERFORMANCE["5500"];
  
  let actualPerformance = Math.round(performanceBase * coefficient * 100) / 100;
  
  // 绩效区间限制：按职级的最低/最高执行
  actualPerformance = Math.max(performanceParams.min, Math.min(performanceParams.max, actualPerformance));

  return {
    "绩效基数": performanceBase,
    "绩效得分": 0,
    "绩效等级": level,
    "绩效系数": coefficient,
    "实发绩效金额": actualPerformance,
    "绩效最低": performanceParams.min,
    "绩效最高": performanceParams.max,
    "正常绩效": performanceParams.normal
  };
}

// 初始化行为事件配置
function initBehaviorEvents() {
  // 内置行为事件配置
  BEHAVIOR_EVENTS = {
    negative: [
      {
        id: 'online-severe-bug',
        name: '线上严重Bug/生产事故',
        dimension: '工作业绩-技术质量把控',
        severityScores: {
          light: -1,
          medium: -3,
          heavy: -5,
          major: -10
        }
      },
      {
        id: 'online-general-bug',
        name: '线上一般Bug/线上报错',
        dimension: '工作业绩-技术质量把控',
        severityScores: {
          light: -1,
          medium: -2,
          heavy: -3
        }
      },
      {
        id: 'code-non-standard',
        name: '代码不规范/不遵守团队规范',
        dimension: '工作业绩-技术质量把控',
        severityScores: {
          light: -1,
          medium: -2
        }
      },
      {
        id: 'delivery-delay',
        name: '上线延期/交付延期',
        dimension: '工作业绩-项目交付情况',
        severityScores: {
          light: -1,
          medium: -3,
          heavy: -5
        }
      },
      {
        id: 'requirement-misunderstanding',
        name: '需求理解偏差导致返工',
        dimension: '工作业绩-项目交付情况',
        severityScores: {
          light: -1,
          medium: -2,
          heavy: -3
        }
      },
      {
        id: 'cross-department-slow-response',
        name: '跨部门协作响应不及时',
        dimension: '工作业绩-跨部门协作与支援',
        severityScores: {
          light: -1,
          medium: -2
        }
      },
      {
        id: 'cross-department-communication-error',
        name: '跨部门沟通失误造成影响',
        dimension: '工作业绩-跨部门协作与支援',
        severityScores: {
          light: -1,
          medium: -3
        }
      },
      {
        id: 'team-progress-out-of-control',
        name: '团队进度失控/排期严重偏差',
        dimension: '管理能力-目标制定与执行',
        severityScores: {
          medium: -3,
          heavy: -5
        }
      },
      {
        id: 'team-member-loss',
        name: '下属人员流失/团队氛围差',
        dimension: '管理能力-团队管理与激励',
        severityScores: {
          heavy: -5
        }
      },
      {
        id: 'shirk-responsibility',
        name: '推卸责任/甩锅',
        dimension: '职业素养与领导力-表率与责任意识',
        severityScores: {
          medium: -2,
          heavy: -3
        }
      },
      {
        id: 'uncooperative',
        name: '不配合团队工作/消极怠工',
        dimension: '职业素养与领导力-沟通与协同意识',
        severityScores: {
          light: -1,
          medium: -2
        }
      },
      {
        id: 'no-active-learning',
        name: '不主动学习/技术停滞',
        dimension: '创新与学习-学习成长',
        severityScores: {
          light: -1
        }
      }
    ],
    positive: [
      {
        id: 'early-delivery',
        name: '提前完成项目交付',
        dimension: '工作业绩-项目交付情况',
        severityScores: {
          medium: 2,
          major: 5
        }
      },
      {
        id: 'solve-difficult-problem',
        name: '解决线上疑难问题/技术攻坚',
        dimension: '工作业绩-技术质量把控',
        severityScores: {
          medium: 3,
          major: 5
        }
      },
      {
        id: 'code-refactoring',
        name: '推动代码重构/质量体系优化',
        dimension: '工作业绩-团队效能提升',
        severityScores: {
          medium: 3,
          major: 5
        }
      },
      {
        id: 'process-optimization',
        name: '上线周期缩短/流程优化',
        dimension: '工作业绩-团队效能提升',
        severityScores: {
          medium: 2,
          major: 4
        }
      },
      {
        id: 'cross-department-support',
        name: '主动支援跨部门项目',
        dimension: '工作业绩-跨部门协作与支援',
        severityScores: {
          medium: 1,
          major: 3
        }
      },
      {
        id: 'employee-development',
        name: '培养出骨干员工/下属晋升',
        dimension: '管理能力-人员培养与梯队建设',
        severityScores: {
          medium: 3,
          major: 5
        }
      },
      {
        id: 'team-process-establishment',
        name: '制定并落地团队流程/制度',
        dimension: '管理能力-目标制定与执行',
        severityScores: {
          medium: 3,
          major: 5
        }
      },
      {
        id: 'technical-sharing',
        name: '技术分享/团队内部分享',
        dimension: '创新与学习-学习成长',
        severityScores: {
          medium: 1,
          major: 3
        }
      },
      {
        id: 'new-technology-adoption',
        name: '引入新技术并落地应用',
        dimension: '创新与学习-技术创新',
        severityScores: {
          medium: 3,
          major: 5
        }
      }
    ]
  };
  
  // 加载自定义事件
  loadCustomEvents();
}

// 加载自定义事件
function loadCustomEvents() {
  const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
  customEvents.forEach(event => {
    if (!BEHAVIOR_EVENTS[event.type]) {
      BEHAVIOR_EVENTS[event.type] = [];
    }
    BEHAVIOR_EVENTS[event.type].push({
      id: event.id,
      name: event.name,
      dimension: event.dimension,
      severityScores: {
        light: event.lightImpact,
        medium: event.mediumImpact,
        heavy: event.heavyImpact,
        major: event.majorImpact
      }
    });
  });
}

// 保存自定义事件
function saveCustomEvents(customEvents) {
  localStorage.setItem('customEvents', JSON.stringify(customEvents));
}

// 显示自定义事件管理弹窗
function showCustomEventModal() {
  const customEventModal = document.getElementById('custom-event-modal');
  customEventModal.style.display = 'flex';
  customEventModal.classList.add('active');
  loadCustomEventList();
}

// 关闭自定义事件管理弹窗
function closeCustomEventModal() {
  const customEventModal = document.getElementById('custom-event-modal');
  customEventModal.style.display = 'none';
  customEventModal.classList.remove('active');
  // 清空表单
  document.getElementById('custom-event-name').value = '';
  document.getElementById('custom-event-type').value = 'positive';
  document.getElementById('custom-event-dimension').value = '';
  document.getElementById('custom-event-light-impact').value = '';
  document.getElementById('custom-event-medium-impact').value = '';
  document.getElementById('custom-event-heavy-impact').value = '';
  document.getElementById('custom-event-major-impact').value = '';
}

// 加载自定义事件列表
function loadCustomEventList() {
  const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
  const customEventList = document.getElementById('custom-event-list').querySelector('tbody');
  
  if (customEvents.length === 0) {
    customEventList.innerHTML = '<tr><td colspan="8" style="text-align: center; color: var(--gray-500)">暂无自定义事件</td></tr>';
    return;
  }
  
  customEventList.innerHTML = customEvents.map(event => `
    <tr>
      <td>${event.name}</td>
      <td>${event.type === 'positive' ? '正面事件' : '负面事件'}</td>
      <td>${event.dimension}</td>
      <td>${event.lightImpact || '-'}</td>
      <td>${event.mediumImpact || '-'}</td>
      <td>${event.heavyImpact || '-'}</td>
      <td>${event.majorImpact || '-'}</td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="deleteCustomEvent('${event.id}')"><i class="fas fa-trash"></i> 删除</button>
      </td>
    </tr>
  `).join('');
}

// 添加自定义事件
function addCustomEvent() {
  const name = document.getElementById('custom-event-name').value.trim();
  const type = document.getElementById('custom-event-type').value;
  const dimension = document.getElementById('custom-event-dimension').value.trim();
  const lightImpact = Number(document.getElementById('custom-event-light-impact').value) || 0;
  const mediumImpact = Number(document.getElementById('custom-event-medium-impact').value) || 0;
  const heavyImpact = Number(document.getElementById('custom-event-heavy-impact').value) || 0;
  const majorImpact = Number(document.getElementById('custom-event-major-impact').value) || 0;
  
  if (!name || !dimension) {
    alert('请填写事件名称和关联维度');
    return;
  }
  
  const customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
  const newEvent = {
    id: 'custom-' + Date.now(),
    name: name,
    type: type,
    dimension: dimension,
    lightImpact: lightImpact,
    mediumImpact: mediumImpact,
    heavyImpact: heavyImpact,
    majorImpact: majorImpact
  };
  
  customEvents.push(newEvent);
  saveCustomEvents(customEvents);
  
  // 更新BEHAVIOR_EVENTS
  if (!BEHAVIOR_EVENTS[type]) {
    BEHAVIOR_EVENTS[type] = [];
  }
  BEHAVIOR_EVENTS[type].push({
    id: newEvent.id,
    name: newEvent.name,
    dimension: newEvent.dimension,
    severityScores: {
      light: newEvent.lightImpact,
      medium: newEvent.mediumImpact,
      heavy: newEvent.heavyImpact,
      major: newEvent.majorImpact
    }
  });
  
  loadCustomEventList();
  alert('自定义事件添加成功！');
  
  // 清空表单
  document.getElementById('custom-event-name').value = '';
  document.getElementById('custom-event-dimension').value = '';
  document.getElementById('custom-event-light-impact').value = '';
  document.getElementById('custom-event-medium-impact').value = '';
  document.getElementById('custom-event-heavy-impact').value = '';
  document.getElementById('custom-event-major-impact').value = '';
}

// 删除自定义事件
function deleteCustomEvent(eventId) {
  if (confirm('确定要删除这个自定义事件吗？')) {
    let customEvents = JSON.parse(localStorage.getItem('customEvents')) || [];
    customEvents = customEvents.filter(event => event.id !== eventId);
    saveCustomEvents(customEvents);
    
    // 重新初始化行为事件
    initBehaviorEvents();
    loadCustomEventList();
    alert('自定义事件删除成功！');
  }
}

// 更新事件选项
function updateEventOptions() {
  const eventType = document.getElementById('behavior-event-type').value;
  const eventSelect = document.getElementById('behavior-event');
  const severitySelect = document.getElementById('behavior-severity');
  const dimensionInput = document.getElementById('behavior-dimension');
  const impactInput = document.getElementById('behavior-impact');
  
  // 重置后续选项
  eventSelect.innerHTML = '';
  severitySelect.innerHTML = '';
  dimensionInput.value = '';
  impactInput.value = '';
  
  if (!eventType) {
    eventSelect.innerHTML = '<option value="">请选择事件类型</option>';
    severitySelect.innerHTML = '<option value="">请先选择事件</option>';
    return;
  }
  
  // 添加事件选项
  const events = BEHAVIOR_EVENTS[eventType];
  eventSelect.innerHTML = '<option value="">请选择事件</option>';
  events.forEach(event => {
    const option = document.createElement('option');
    option.value = event.id;
    option.textContent = event.name;
    eventSelect.appendChild(option);
  });
  
  severitySelect.innerHTML = '<option value="">请先选择事件</option>';
}

// 更新严重程度选项
function updateSeverityOptions() {
  const eventType = document.getElementById('behavior-event-type').value;
  const eventId = document.getElementById('behavior-event').value;
  const severitySelect = document.getElementById('behavior-severity');
  const dimensionInput = document.getElementById('behavior-dimension');
  const impactInput = document.getElementById('behavior-impact');
  
  // 重置后续选项
  severitySelect.innerHTML = '';
  dimensionInput.value = '';
  impactInput.value = '';
  
  if (!eventType || !eventId) {
    severitySelect.innerHTML = '<option value="">请先选择事件</option>';
    return;
  }
  
  // 查找事件
  const events = BEHAVIOR_EVENTS[eventType];
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    // 添加严重程度选项
    severitySelect.innerHTML = '<option value="">请选择严重程度</option>';
    Object.keys(event.severityScores).forEach(severity => {
      const option = document.createElement('option');
      option.value = severity;
      option.textContent = SEVERITY_LEVELS[severity];
      severitySelect.appendChild(option);
    });
    
    // 更新维度
    dimensionInput.value = event.dimension;
  }
}

// 更新维度和影响分
function updateDimensionAndImpact() {
  const eventType = document.getElementById('behavior-event-type').value;
  const eventId = document.getElementById('behavior-event').value;
  const severity = document.getElementById('behavior-severity').value;
  const dimensionInput = document.getElementById('behavior-dimension');
  const impactInput = document.getElementById('behavior-impact');
  
  if (!eventType || !eventId || !severity) {
    return;
  }
  
  // 查找事件
  const events = BEHAVIOR_EVENTS[eventType];
  const event = events.find(e => e.id === eventId);
  
  if (event) {
    // 更新影响分
    impactInput.value = event.severityScores[severity];
  }
}

// 加载行为影响
function loadBehaviorImpact() {
  const employeeId = Number(document.getElementById('score-employee').value);
  const period = document.getElementById('score-period').value;
  
  if (!employeeId || !period) {
    document.getElementById('behavior-summary').style.display = 'none';
    return;
  }
  
  const employeeBehaviors = behaviors.filter(b => 
    b.employee_id === employeeId && b.period === period
  );
  
  if (employeeBehaviors.length === 0) {
    document.getElementById('behavior-summary').style.display = 'none';
    return;
  }
  
  document.getElementById('behavior-summary').style.display = 'block';
  const impactList = document.getElementById('behavior-impact-list');
  
  impactList.innerHTML = employeeBehaviors.map(b => `
    <div class="behavior-impact-item">
      <span class="behavior-impact-desc">${b.description} (${b.count}次)</span>
      <span class="behavior-impact-score" style="color: ${b.score > 0 ? 'green' : 'red'}">${b.score > 0 ? '+' : ''}${b.score}</span>
    </div>
  `).join('');
}

// 添加行为记录
function addBehavior() {
  const employeeId = Number(document.getElementById('behavior-employee').value);
  const eventType = document.getElementById('behavior-event-type').value;
  const eventId = document.getElementById('behavior-event').value;
  const severity = document.getElementById('behavior-severity').value;
  const dimension = document.getElementById('behavior-dimension').value;
  const impact = Number(document.getElementById('behavior-impact').value);
  const desc = document.getElementById('behavior-desc').value;
  const period = document.getElementById('behavior-period').value;
  
  if (!employeeId || !eventType || !eventId || !severity || !period) {
    alert('请填写完整的行为记录信息');
    return;
  }
  
  // 检查员工是否存在
  const employeeExists = employees.some(e => e.id === employeeId);
  if (!employeeExists) {
    alert('员工不存在，无法添加行为记录');
    return;
  }
  
  // 查找事件
  const events = BEHAVIOR_EVENTS[eventType];
  const event = events.find(e => e.id === eventId);
  
  if (!event) {
    alert('未找到对应的事件，请重新选择');
    return;
  }
  
  // 直接在本地添加行为记录
  const newBehavior = {
    id: behaviors.length > 0 ? Math.max(...behaviors.map(b => b.id)) + 1 : 1,
    employee_id: employeeId,
    description: desc,
    type: eventType === 'positive' ? 'positive' : 'negative',
    dimension: dimension,
    event: event.name,
    severity: severity,
    score: impact,
    period: period,
    created_at: new Date().toISOString()
  };
  
  behaviors.push(newBehavior);
  saveData();
  updateBehaviorList();
  loadOverview();
  syncBehaviorToPerformance();
  
  // 清空表单
  document.getElementById('behavior-event-type').value = '';
  document.getElementById('behavior-event').innerHTML = '<option value="">请先选择事件类型</option>';
  document.getElementById('behavior-severity').innerHTML = '<option value="">请先选择事件</option>';
  document.getElementById('behavior-dimension').value = '';
  document.getElementById('behavior-impact').value = '';
  document.getElementById('behavior-desc').value = '';
  document.getElementById('behavior-period').value = '';
  document.getElementById('preview-type').textContent = '-';
  document.getElementById('preview-dimension').textContent = '-';
  document.getElementById('preview-severity').textContent = '-';
  document.getElementById('preview-impact').textContent = '-';
  
  alert('行为记录添加成功！');
}

// 更新行为列表
function updateBehaviorList() {
  const behaviorList = document.getElementById('behavior-list');
  
  if (!behaviorList) {
    return;
  }
  
  if (behaviors.length === 0) {
    behaviorList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-500)">暂无行为记录</td></tr>';
    return;
  }
  
  behaviorList.innerHTML = behaviors.map(b => {
    const employee = employees.find(e => e.id === b.employee_id);
    const severityNames = { light: '轻微', medium: '中等', heavy: '严重' };
    return `
      <tr>
        <td>${employee?.name || '未知'}</td>
        <td>${b.description}</td>
        <td>${b.dimension}</td>
        <td>${severityNames[b.severity]}</td>
        <td style="color: ${b.type === 'positive' ? 'green' : 'red'}">${b.score > 0 ? '+' : ''}${b.score}</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteBehavior(${b.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

// 删除行为记录
function deleteBehavior(behaviorId) {
  // 直接在本地删除行为记录
  behaviors = behaviors.filter(b => b.id !== behaviorId);
  saveData();
  updateBehaviorList();
  loadOverview();
  syncBehaviorToPerformance();
  alert('行为记录删除成功！');
}

// 更新评分列表
function updateScoreList() {
  const scoreList = document.getElementById('score-list');
  
  if (!scoreList) {
    return;
  }
  
  if (scores.length === 0) {
    scoreList.innerHTML = '<tr><td colspan="6" style="text-align: center; color: var(--gray-500)">暂无考核记录</td></tr>';
    return;
  }
  
  scoreList.innerHTML = scores.map(s => {
    const employee = employees.find(e => e.id === s.employee_id);
    return `
      <tr>
        <td>${employee?.name || '未知'}</td>
        <td>${s.period}</td>
        <td>${s.total_score.toFixed(1)}</td>
        <td>${s.grade}</td>
        <td>${s.bonus_rate}%</td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteScore(${s.id})"><i class="fas fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

// 删除评分记录
function deleteScore(scoreId) {
  scores = scores.filter(s => s.id !== scoreId);
  saveData();
  updateScoreList();
  loadOverview();
  loadRanking();
  loadSalaryDetails();
  alert('评分记录删除成功！');
}

// 更新预览
function updatePreview() {
  const taskCompletion = Number(document.getElementById('task_completion').value);
  const taskQuality = Number(document.getElementById('task_quality').value);
  const workEfficiency = Number(document.getElementById('work_efficiency').value);
  const performanceContribution = Number(document.getElementById('performance_contribution').value);
  const responsibility = Number(document.getElementById('responsibility').value);
  const teamwork = Number(document.getElementById('teamwork').value);
  const initiative = Number(document.getElementById('initiative').value);
  const discipline = Number(document.getElementById('discipline').value);
  const professionalEthics = Number(document.getElementById('professional_ethics').value);
  const communication = Number(document.getElementById('communication').value);
  const innovation = Number(document.getElementById('innovation').value);
  const learningAbility = Number(document.getElementById('learning_ability').value);
  
  // 计算总分
  const totalScore = (
    taskCompletion * 0.15 +
    taskQuality * 0.10 +
    workEfficiency * 0.10 +
    performanceContribution * 0.05 +
    responsibility * 0.10 +
    teamwork * 0.05 +
    initiative * 0.05 +
    discipline * 0.10 +
    professionalEthics * 0.05 +
    communication * 0.05 +
    innovation * 0.10 +
    learningAbility * 0.10
  ) * 10; // 转换为0-100分
  
  // 计算等级和奖金比例
  const grade = calculateGrade(totalScore);
  const bonusRate = calculateBonusRate(grade);
  
  document.getElementById('preview-score').textContent = totalScore.toFixed(1);
  document.getElementById('preview-grade').textContent = grade;
  document.getElementById('preview-bonus').textContent = bonusRate + '%';
  
  // 更新滑块值显示
  document.getElementById('task_completion-val').textContent = taskCompletion;
  document.getElementById('task_quality-val').textContent = taskQuality;
  document.getElementById('work_efficiency-val').textContent = workEfficiency;
  document.getElementById('performance_contribution-val').textContent = performanceContribution;
  document.getElementById('responsibility-val').textContent = responsibility;
  document.getElementById('teamwork-val').textContent = teamwork;
  document.getElementById('initiative-val').textContent = initiative;
  document.getElementById('discipline-val').textContent = discipline;
  document.getElementById('professional_ethics-val').textContent = professionalEthics;
  document.getElementById('communication-val').textContent = communication;
  document.getElementById('innovation-val').textContent = innovation;
  document.getElementById('learning_ability-val').textContent = learningAbility;
}

// 计算等级
function calculateGrade(score) {
  if (score >= 95) return 'A+';
  if (score >= 90) return 'A';
  if (score >= 80) return 'B+';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  return 'D';
}

// 计算奖金比例
function calculateBonusRate(grade) {
  switch (grade) {
    case 'A+': return 150;
    case 'A': return 130;
    case 'B+': return 110;
    case 'B': return 100;
    case 'C': return 50;
    case 'D': return 0;
    default: return 100;
  }
}

// 计算绩效发放金额
function calculatePerformancePayout(performanceBase, score) {
  let coefficient, level;
  
  const safeScore = Math.max(0, Math.min(100, score));
  
  if (safeScore >= 95) {
    coefficient = 1.5;
    level = "A+";
  } else if (safeScore >= 90) {
    coefficient = 1.3;
    level = "A";
  } else if (safeScore >= 80) {
    coefficient = 1.1;
    level = "B+";
  } else if (safeScore >= 70) {
    coefficient = 1.0;
    level = "B";
  } else if (safeScore >= 60) {
    coefficient = 0.5;
    level = "C";
  } else {
    coefficient = 0.2;
    level = "D";
  }

  const actualPerformance = Math.round(performanceBase * coefficient * 100) / 100;
  // 绩效区间限制
  return Math.max(100, Math.min(750, actualPerformance));
}

// 添加评分
function addScore() {
  const employeeId = Number(document.getElementById('score-employee').value);
  const period = document.getElementById('score-period').value;
  const comment = document.getElementById('score-comment').value;
  
  if (!employeeId || !period) {
    alert('请选择员工和考核周期');
    return;
  }
  
  const taskCompletion = Number(document.getElementById('task_completion').value);
  const taskQuality = Number(document.getElementById('task_quality').value);
  const workEfficiency = Number(document.getElementById('work_efficiency').value);
  const performanceContribution = Number(document.getElementById('performance_contribution').value);
  const responsibility = Number(document.getElementById('responsibility').value);
  const teamwork = Number(document.getElementById('teamwork').value);
  const initiative = Number(document.getElementById('initiative').value);
  const discipline = Number(document.getElementById('discipline').value);
  const professionalEthics = Number(document.getElementById('professional_ethics').value);
  const communication = Number(document.getElementById('communication').value);
  const innovation = Number(document.getElementById('innovation').value);
  const learningAbility = Number(document.getElementById('learning_ability').value);
  
  // 计算总分
  const totalScore = (
    taskCompletion * 0.15 +
    taskQuality * 0.10 +
    workEfficiency * 0.10 +
    performanceContribution * 0.05 +
    responsibility * 0.10 +
    teamwork * 0.05 +
    initiative * 0.05 +
    discipline * 0.10 +
    professionalEthics * 0.05 +
    communication * 0.05 +
    innovation * 0.10 +
    learningAbility * 0.10
  ) * 10; // 转换为0-100分
  
  // 计算等级和奖金比例
  const grade = calculateGrade(totalScore);
  const bonusRate = calculateBonusRate(grade);
  
  const newScore = {
    id: scores.length > 0 ? Math.max(...scores.map(s => s.id)) + 1 : 1,
    employee_id: employeeId,
    period: period,
    task_completion: taskCompletion,
    task_quality: taskQuality,
    work_efficiency: workEfficiency,
    performance_contribution: performanceContribution,
    responsibility: responsibility,
    teamwork: teamwork,
    initiative: initiative,
    discipline: discipline,
    professional_ethics: professionalEthics,
    communication: communication,
    innovation: innovation,
    learning_ability: learningAbility,
    total_score: totalScore,
    grade: grade,
    bonus_rate: bonusRate,
    comment: comment,
    created_at: new Date().toISOString()
  };
  
  scores.push(newScore);
  saveData();
  updateScoreList();
  loadOverview();
  loadRanking();
  loadSalaryDetails();
  
  alert('评分提交成功！');
}

// 加载排行榜
function loadRanking() {
  const rankingList = document.getElementById('ranking-list');
  
  if (!rankingList) {
    return;
  }
  
  if (scores.length === 0) {
    rankingList.innerHTML = '<tr><td colspan="7" style="text-align: center; color: var(--gray-500)">暂无考核数据</td></tr>';
    return;
  }
  
  // 计算每个员工的平均分
  const employeeScores = {};
  scores.forEach(score => {
    if (!employeeScores[score.employee_id]) {
      employeeScores[score.employee_id] = {
        total: 0,
        count: 0,
        scores: []
      };
    }
    employeeScores[score.employee_id].total += score.total_score;
    employeeScores[score.employee_id].count += 1;
    employeeScores[score.employee_id].scores.push(score);
  });
  
  // 生成排行榜数据
  const rankingData = Object.entries(employeeScores).map(([employeeId, data]) => {
    const employee = employees.find(e => e.id === Number(employeeId));
    const avgScore = data.total / data.count;
    const latestScore = data.scores.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    // 计算行为影响
    const employeeBehaviors = behaviors.filter(b => b.employee_id === Number(employeeId));
    const behaviorImpact = employeeBehaviors.reduce((sum, b) => sum + b.score, 0);
    
    return {
      employee_id: Number(employeeId),
      name: employee?.name || '未知',
      department: employee?.department || '未分配',
      avg_score: avgScore,
      grade: latestScore?.grade || 'B',
      behavior_impact: behaviorImpact,
      count: data.count
    };
  }).sort((a, b) => b.avg_score - a.avg_score);
  
  rankingList.innerHTML = rankingData.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>${item.name}</td>
      <td>${item.department}</td>
      <td>${item.avg_score.toFixed(1)}</td>
      <td>${item.grade}</td>
      <td style="color: ${item.behavior_impact > 0 ? 'green' : 'red'}">${item.behavior_impact > 0 ? '+' : ''}${item.behavior_impact}</td>
      <td>${item.count}</td>
    </tr>
  `).join('');
}

// 加载薪资明细
function loadSalaryDetails() {
  const salaryList = document.getElementById('salary-list');
  
  if (!salaryList) {
    return;
  }
  
  if (employees.length === 0) {
    salaryList.innerHTML = '<tr><td colspan="11" style="text-align: center; color: var(--gray-500)">暂无薪资数据</td></tr>';
    return;
  }
  
  salaryList.innerHTML = employees.map(employee => {
    const salaryStructure = salaryStructures.find(ss => ss.employee_id === employee.id);
    const latestScore = scores.filter(s => s.employee_id === employee.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    // 计算固定工资合计（月薪）
    const basicSalary = salaryStructure?.basic_salary || 0;
    const positionSalary = salaryStructure?.position_salary || 0;
    const fullAttendanceSalary = salaryStructure?.full_attendance_salary || 0;
    const mealAllowance = salaryStructure?.meal_allowance || 0;
    const commuteAllowance = salaryStructure?.commute_allowance || 0;
    const welfareFund = salaryStructure?.welfare_fund || 0;
    const monthlySalary = basicSalary + positionSalary + fullAttendanceSalary + mealAllowance + commuteAllowance + welfareFund;
    
    // 计算实发绩效
    let actualPerformance = 0;
    let performanceScore = '-';
    let performanceGrade = 'B（默认）';
    let performanceCoefficient = 1.0;
    
    if (salaryStructure) {
      if (latestScore) {
        performanceScore = latestScore.total_score.toFixed(1);
        performanceGrade = latestScore.grade;
        
        // 计算绩效系数
        if (latestScore.total_score >= 95) {
          performanceCoefficient = 1.5;
        } else if (latestScore.total_score >= 90) {
          performanceCoefficient = 1.3;
        } else if (latestScore.total_score >= 80) {
          performanceCoefficient = 1.1;
        } else if (latestScore.total_score >= 70) {
          performanceCoefficient = 1.0;
        } else if (latestScore.total_score >= 60) {
          performanceCoefficient = 0.5;
        } else {
          performanceCoefficient = 0.2;
        }
        
        const performanceResult = calculatePerformancePayout(salaryStructure.performance_base, latestScore.total_score);
        actualPerformance = performanceResult["实发绩效金额"];
      } else {
        // 未评分时默认等级B，系数1.0
        actualPerformance = salaryStructure.performance_base * 1.0;
        // 绩效区间限制
        actualPerformance = Math.max(100, Math.min(750, actualPerformance));
      }
    }
    
    // 计算实发工资
    let actualSalary = 0;
    if (salaryStructure) {
      actualSalary = monthlySalary + actualPerformance;
    }
    
    // 处理等级样式
    let gradeClass = 'grade-B';
    if (performanceGrade === 'A+') {
      gradeClass = 'grade-A-plus';
    } else if (performanceGrade === 'A') {
      gradeClass = 'grade-A';
    } else if (performanceGrade === 'B+') {
      gradeClass = 'grade-B-plus';
    } else if (performanceGrade === 'C') {
      gradeClass = 'grade-C';
    } else if (performanceGrade === 'D') {
      gradeClass = 'grade-D';
    }
    
    return `
      <tr>
        <td>${employee.id}</td>
        <td>${employee.name}</td>
        <td class="editable">
          <input type="text" value="${employee.department || '未分配'}" onblur="updateEmployeeDepartment(${employee.id}, this.value)">
        </td>
        <td>${employee.position || '未设置'}</td>
        <td class="text-right">${monthlySalary.toFixed(2)}</td>
        <td class="text-right">${salaryStructure?.performance_base || 0}</td>
        <td class="text-right">${performanceScore}</td>
        <td><span class="${gradeClass}">${performanceGrade}</span></td>
        <td class="text-right">${performanceCoefficient.toFixed(2)}</td>
        <td class="text-right">${actualPerformance.toFixed(2)}</td>
        <td class="text-right">${actualSalary.toFixed(2)}</td>
      </tr>
    `;
  }).join('');
}

// 更新员工部门
function updateEmployeeDepartment(employeeId, newDepartment) {
  const employee = employees.find(e => e.id === employeeId);
  if (employee) {
    employee.department = newDepartment;
    saveData();
    // 不需要刷新整个表格，只需要更新当前单元格
  }
}

// 计算行为记录对绩效的影响
function calculateBehaviorImpact(employeeId, period) {
  // 获取员工的所有行为记录
  const employeeBehaviors = behaviors.filter(b => b.employee_id === employeeId && b.period === period);
  
  // 计算行为记录的总影响分
  let totalImpact = 0;
  employeeBehaviors.forEach(behavior => {
    totalImpact += behavior.score;
  });
  
  return totalImpact;
}

// 更新员工绩效数据
function updateEmployeePerformance(employeeId) {
  // 获取员工的最新评分
  const latestScore = scores.filter(s => s.employee_id === employeeId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  
  if (latestScore) {
    // 计算行为记录的影响
    const behaviorImpact = calculateBehaviorImpact(employeeId, latestScore.period);
    
    // 更新总分
    let newTotalScore = latestScore.total_score + behaviorImpact;
    // 确保分数在0-100之间
    newTotalScore = Math.max(0, Math.min(100, newTotalScore));
    
    // 更新等级和奖金比例
    const newGrade = calculateGrade(newTotalScore);
    const newBonusRate = calculateBonusRate(newGrade);
    
    // 更新评分记录
    latestScore.total_score = newTotalScore;
    latestScore.grade = newGrade;
    latestScore.bonus_rate = newBonusRate;
    
    saveData();
  }
}

// 同步行为记录到绩效
function syncBehaviorToPerformance() {
  // 遍历所有员工
  employees.forEach(employee => {
    updateEmployeePerformance(employee.id);
  });
  
  // 刷新相关页面
  updateScoreList();
  loadRanking();
  loadSalaryDetails();
  updateEmployeeCards();
}

// 导出薪资数据
function exportSalaryDetails() {
  const csvContent = "员工编号,姓名,部门,职位,月薪,绩效基数,绩效得分,绩效等级,绩效系数,实发绩效金额,实发薪资\n";
  
  const csvRows = employees.map(employee => {
    const salaryStructure = salaryStructures.find(ss => ss.employee_id === employee.id);
    const latestScore = scores.filter(s => s.employee_id === employee.id).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
    
    // 计算固定工资合计（月薪）
    const basicSalary = salaryStructure?.basic_salary || 0;
    const positionSalary = salaryStructure?.position_salary || 0;
    const fullAttendanceSalary = salaryStructure?.full_attendance_salary || 0;
    const mealAllowance = salaryStructure?.meal_allowance || 0;
    const commuteAllowance = salaryStructure?.commute_allowance || 0;
    const welfareFund = salaryStructure?.welfare_fund || 0;
    const monthlySalary = basicSalary + positionSalary + fullAttendanceSalary + mealAllowance + commuteAllowance + welfareFund;
    
    // 计算实发绩效
    let actualPerformance = 0;
    let performanceScore = '-';
    let performanceGrade = 'B（默认）';
    let performanceCoefficient = 1.0;
    
    if (salaryStructure) {
      if (latestScore) {
        performanceScore = latestScore.total_score.toFixed(1);
        performanceGrade = latestScore.grade;
        
        // 计算绩效系数
        if (latestScore.total_score >= 95) {
          performanceCoefficient = 1.5;
        } else if (latestScore.total_score >= 90) {
          performanceCoefficient = 1.3;
        } else if (latestScore.total_score >= 80) {
          performanceCoefficient = 1.1;
        } else if (latestScore.total_score >= 70) {
          performanceCoefficient = 1.0;
        } else if (latestScore.total_score >= 60) {
          performanceCoefficient = 0.5;
        } else {
          performanceCoefficient = 0.2;
        }
        
        const performanceResult = calculatePerformancePayout(salaryStructure.performance_base, latestScore.total_score);
        actualPerformance = performanceResult["实发绩效金额"];
      } else {
        // 未评分时默认等级B，系数1.0
        actualPerformance = salaryStructure.performance_base * 1.0;
        // 绩效区间限制
        actualPerformance = Math.max(100, Math.min(750, actualPerformance));
      }
    }
    
    // 计算实发工资
    let actualSalary = 0;
    if (salaryStructure) {
      actualSalary = monthlySalary + actualPerformance;
    }
    
    return `${employee.id},${employee.name},${employee.department || '未分配'},${employee.position || '未设置'},${monthlySalary.toFixed(2)},${salaryStructure?.performance_base || 0},${performanceScore},${performanceGrade},${performanceCoefficient.toFixed(2)},${actualPerformance.toFixed(2)},${actualSalary.toFixed(2)}`;
  });
  
  const csvFullContent = csvContent + csvRows.join('\n');
  const blob = new Blob([csvFullContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `薪资核算明细_${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  alert('导出成功！');
}

// 查看薪资明细
function viewSalaryDetails(employeeId) {
  const employee = employees.find(e => e.id === employeeId);
  const salaryStructure = salaryStructures.find(ss => ss.employee_id === employeeId);
  const latestScore = scores.filter(s => s.employee_id === employeeId).sort((a, b) => new Date(b.created_at) - new Date(a.created_at))[0];
  
  // 计算实发绩效
  let actualPerformance = 0;
  if (salaryStructure) {
    if (latestScore) {
      const performanceResult = calculatePerformancePayout(salaryStructure.performance_base, latestScore.total_score);
        actualPerformance = performanceResult["实发绩效金额"];
    } else {
      // 未评分时默认等级B，系数1.0
      actualPerformance = salaryStructure.performance_base * 1.0;
      // 绩效区间限制
      actualPerformance = Math.max(100, Math.min(750, actualPerformance));
    }
  }
  
  // 计算实发工资
  let actualSalary = 0;
  if (salaryStructure) {
    actualSalary = (
      salaryStructure.basic_salary +
      salaryStructure.position_salary +
      salaryStructure.full_attendance_salary +
      salaryStructure.meal_allowance +
      salaryStructure.commute_allowance +
      salaryStructure.welfare_fund +
      actualPerformance
    );
  }
  
  // 显示薪资明细
  const details = `
    薪资明细
    员工：${employee.name}
    部门：${employee.department || '未分配'}
    职位：${employee.position || '未设置'}
    职级：${salaryStructure?.position_level || '未设置'}
    在职情况：${salaryStructure?.employment_status || '正式工'}
    
    固定工资组成：
    月基本工资：${salaryStructure?.basic_salary || 0}
    岗位工资：${salaryStructure?.position_salary || 0}
    全勤工资：${salaryStructure?.full_attendance_salary || 0}
    餐费补贴：${salaryStructure?.meal_allowance || 0}
    通勤补贴：${salaryStructure?.commute_allowance || 0}
    福利金：${salaryStructure?.welfare_fund || 0}
    
    绩效相关：
    绩效基数：${salaryStructure?.performance_base || 0}
    绩效得分：${latestScore?.total_score ? latestScore.total_score.toFixed(1) : '-'}
    绩效等级：${latestScore?.grade || 'B（默认）'}
    绩效系数：${latestScore ? (latestScore.total_score >= 95 ? 1.5 : latestScore.total_score >= 90 ? 1.3 : latestScore.total_score >= 80 ? 1.1 : latestScore.total_score >= 70 ? 1.0 : latestScore.total_score >= 60 ? 0.5 : 0.2) : 1.0}
    实发绩效金额：${actualPerformance.toFixed(2)}
    
    实发工资：${actualSalary.toFixed(2)}
  `;
  
  alert(details);
}

// 页面加载时初始化员工选择框
window.onload = function() {
  // 初始化行为事件配置
  initBehaviorEvents();
  
  // 填充员工选择框
  const behaviorEmployeeSelect = document.getElementById('behavior-employee');
  const scoreEmployeeSelect = document.getElementById('score-employee');
  
  if (behaviorEmployeeSelect) {
    behaviorEmployeeSelect.innerHTML = '<option value="">选择员工</option>' + employees.map(emp => `
      <option value="${emp.id}">${emp.name} - ${emp.position}</option>
    `).join('');
  }
  
  if (scoreEmployeeSelect) {
    scoreEmployeeSelect.innerHTML = '<option value="">选择员工</option>' + employees.map(emp => `
      <option value="${emp.id}">${emp.name} - ${emp.position}</option>
    `).join('');
  }
  
  // 设置默认月份
  const today = new Date();
  const currentMonth = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0');
  
  const behaviorPeriod = document.getElementById('behavior-period');
  const scorePeriod = document.getElementById('score-period');
  
  if (behaviorPeriod) behaviorPeriod.value = currentMonth;
  if (scorePeriod) scorePeriod.value = currentMonth;
  
  // 初始化预览
  if (typeof updatePreview === 'function') updatePreview();
  if (typeof previewBehavior === 'function') previewBehavior();
};