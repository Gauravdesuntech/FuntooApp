/*
*
* move and modify from cashflow app
* updated by - Rahul Saha
* updated on - 24.11.22
*
*/



import Configs from "../../config/Configs";
import HttpClient from "../../utils/HttpClient";
import Storage from "../../utils/Storage";

const BASE_URL = Configs.CASHFLOW_PATH;
// const BASE_URL = "https://funtoo.invoice2day.in/cashflowdev/api/";
//const BASE_URL = "http://funtoogames.com/money-lover/api/";

//const BASE_URL = "http://192.168.0.105/money-lover/api/";
async function login(email, password) {
  let endpoint = "login.php?email=" + email + "&password=" + password;
  // let token = await NotificationService.getPushToken();
  let data = {
    email: email,
    password: password,
    // expo_token : token,
  };

  // console.log(endpoint);
  return HttpClient.post(endpoint, data);
}
async function mpinlogin(password) {
  let endpoint = "mpinLogin.php?password=" + password;
  //console.log(endpoint);
  // let token = await NotificationService.getPushToken();
  return HttpClient.post(endpoint);
}

function register(name, email, password) {
  let endpoint =
    "signup.php?name=" + name + "&email=" + email + "&password=" + password;

  let data = {
    name: name,
    email: email,
    password: password,
    // expo_token : token,
  };
  //console.log(endpoint)
  return HttpClient.post(endpoint, data);
}

function retriveAccount(userCode, userId) {
  let endpoint = `Income/getAccount?userCode=${userCode}&userId=${userId}`;
  //console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function incomeAdd(
  date,
  project_id,
  sub_project,
  accountName,
  catName,
  amount,
  event,
  memo,
  imageURI,
  userCode,
  extraData_id,
  subproject_name
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("sub_project", sub_project);
  formData.append("accountName", accountName);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("event", event);
  formData.append("memo", memo);
  formData.append("userCode", userCode);
  formData.append("extra_id", extraData_id);
  formData.append("event_details", subproject_name);

  if (imageURI != null) {
    const uriPart = imageURI.split(".");
    const fileExtension = uriPart[uriPart.length - 1];

    formData.append("image", {
      uri: imageURI,
      name: `trans.${fileExtension}`,
      type: `image/${fileExtension}`,
    });
  }
  //Add photo
  //this, retrive the file extension of photo

  // console.log("Formdata", formData);
  // return;
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "Income/income_add", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
  .then((response) =>  response.json())
  .then((responseJson) => {
      // console.log("response", responseJson);
      return responseJson;
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}

async function expenseAdd(
  date,
  project_id,
  sub_project,
  accountName,
  Vendor_id,
  catName,
  amount,
  event,
  memo,
  imageURI,
  userCode,
  extraData_id,
  subproject_name
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("sub_project", sub_project);
  formData.append("accountName", accountName);
  formData.append("VendorID", Vendor_id);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("event", event);
  formData.append("memo", memo);
  formData.append("userCode", userCode);
  formData.append("extra_id", extraData_id);
  formData.append("event_details", subproject_name);

  if (imageURI != null) {
    //Add photo
    //this, retrive the file extension of photo
    const uriPart = imageURI.split(".");
    const fileExtension = uriPart[uriPart.length - 1];

    formData.append("image", {
      uri: imageURI,
      name: `trans.${fileExtension}`,
      type: `image/${fileExtension}`,
    });
  }
  // console.log("Formdata", formData);
  // return
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "Expense/expense_add", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("response", responseJson);
      return responseJson;
      //console.log("response", responseJson);
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}
async function expenseUpdate(
  date,
  project_id,
  sub_project,
  accountName,
  vendor_id,
  catName,
  amount,
  event,
  memo,
  imageURI,
  imageName,
  expenseId,
  userCode,
  extraData_id,
  subproject_name
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("sub_project", sub_project);
  formData.append("accountName", accountName);
  formData.append("vendorID", vendor_id);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("event", event);
  formData.append("memo", memo);
  formData.append("expenseId", expenseId);
  formData.append("userCode", userCode);
  formData.append("extra_id", extraData_id);
  formData.append("event_details", subproject_name);
  // if (imageURI != null) {
  //   //Add photo
  //   //this, retrive the file extension of photo
  //   const uriPart = imageURI.split(".");
  //   const fileExtension = uriPart[uriPart.length - 1];

  //   formData.append("image", {
  //     uri: imageURI,
  //     name: `trans.${fileExtension}`,
  //     type: `image/${fileExtension}`,
  //   });
  // } else {
  //   formData.append("image", imageURI);
  // }

  // console.log("Formdata", formData);
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "Expense/expense_update", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) =>response.json())
    .then((responseJson) => {
      console.log("response................", responseJson);
      return responseJson;
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}

async function incomeUpdate(
  date,
  project_id,
  sub_project,
  accountName,
  catName,
  amount,
  event,
  memo,
  imageURI,
  imageName,
  expenseId,
  userCode,
  extraData_id,
  subproject_name
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("subProject", sub_project);
  formData.append("accountName", accountName);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("event", event);
  formData.append("memo", memo);
  formData.append("incomeId", expenseId);
  formData.append("userCode", userCode);
  formData.append("extra_id", extraData_id);
  formData.append("event_details", subproject_name);

  // if (imageURI != null) {
  //   //Add photo
  //   //this, retrive the file extension of photo
  //   const uriPart = imageURI.split(".");
  //   const fileExtension = uriPart[uriPart.length - 1];

  //   formData.append("photo", {
  //     uri: imageURI,
  //     name: `trans.${fileExtension}`,
  //     type: `image/${fileExtension}`,
  //   });
  // } else {
  //   formData.append("photo", imageURI);
  // }

  // console.log("Formdata", formData);
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "Income/income_update", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) =>response.json())
    .then((responseJson) => {
      console.log("response", responseJson);
      return responseJson;
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}
async function updateAccount(name, email, mobile, userCode) {
  const formData = new FormData();
  //Adding input data
  formData.append("name", name);
  formData.append("email", email);
  formData.append("mobile", mobile);
  formData.append("userCode", userCode);

  // console.log("Formdata", formData)
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "updateAccount.php", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("response", responseJson);
      return responseJson;
      // console.log("response", responseJson);
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      // console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}

async function updateProfilePic(imageURI, userCode) {
  const formData = new FormData();

  //Adding input data
  formData.append("userCode", userCode);
  //Add photo
  //this, retrive the file extension of photo
  const uriPart = imageURI.split(".");
  const fileExtension = uriPart[uriPart.length - 1];

  formData.append("photo", {
    uri: imageURI,
    name: `trans.${fileExtension}`,
    type: `image/${fileExtension}`,
  });

  // console.log("Formdata", formData);
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "profile_pic_update.php", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
      // console.log("response", responseJson);
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      //console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}

async function fetchDetailsAccounts(userType, userCode) {
  let endpoint = `Income/fetchAccountDetails?userType=${userType}&userCode=${userCode}`;
  // console.log("Endpoint For fetchDetailsAccounts");
  return HttpClient.post(endpoint);
}

async function fetchAccountAllDetails(userType, logedinUserCode, userCode) {
  let endpoint = `GetDetails/fetchAccountAllDetails?whoIsAsking=${userType}&askingUserCode=${logedinUserCode}&userCode=${userCode}`;
  //console.log("Endpoint For fetchDetailsAccounts");
  return HttpClient.post(endpoint);
}

async function getParentCat() {
  let endpoint = `getParentCat.php`;
  return HttpClient.post(endpoint);
}

async function createCat(catName, catType, isParent, parentCatId, user) {
  let str = catName;
  let cateName = str.replace(/ /g, "_");

  let endpoint = `addCategory.php?cat_name=${cateName}&cat_type=${catType}&is_parent=${isParent}&parent_cat_id=${parentCatId}&createdby=${user}`;
  return HttpClient.post(endpoint);
}

async function addTransfer(
  date,
  project_id,
  sub_project,
  accountName,
  catName,
  amount,
  memo,
  imageURI,
  userID,
  userCode,
  extraData_id,
  subproject_name
) {

  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("sub_project", sub_project);
  formData.append("accountName", accountName);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("memo", memo);
  formData.append("userID", userID);
  formData.append("userCode", userCode);
  formData.append("extra_id", extraData_id);
  formData.append("event_details", subproject_name);

  if (imageURI != null) {
    const uriPart = imageURI.split(".");
    const fileExtension = uriPart[uriPart.length - 1];

    formData.append("photo", {
      uri: imageURI,
      name: `trans.${fileExtension}`,
      type: `image/${fileExtension}`,
    });
  }
 

  // console.log(".........Formdata..........", formData);
  // return;
  return await fetch(BASE_URL + "Income/saveTransfer", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("..........response................", responseJson);
      return responseJson;
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      // console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });

  // let endpoint = `saveTransfer.php?date=${date}&projectid=${project_id}&subProject=${sub_project}&account_name=${accountName}&category_name=${catName}&amount=${amount}&memo=${memo}&user_id=${userID}&userCode=${userCode}`;
  // // console.log(endpoint);
  // return HttpClient.post(endpoint);
}
async function updateTransfer(
  date,
  project_id,
  sub_project,
  accountName,
  catName,
  amount,
  memo,
  userID,
  imageURI,
  userCode,
  expenseID,
  extra_id,
  subproject_name
) {

  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("sub_project", sub_project);
  formData.append("accountName", accountName);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("memo", memo);
  formData.append("expenseID", expenseID);
  formData.append("userCode", userCode);
  formData.append("userID", userID);
  formData.append("extra_id", extra_id);
  formData.append("event_details", subproject_name);

  // if (imageURI != null) {
  //   const uriPart = imageURI.split(".");
  //   const fileExtension = uriPart[uriPart.length - 1];

  //   formData.append("photo", {
  //     uri: imageURI,
  //     name: `trans.${fileExtension}`,
  //     type: `image/${fileExtension}`,
  //   });
  // }
 

  console.log("Formdata", formData);
  // return;
  return await fetch(BASE_URL + "Income/updateTransfer", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("response", responseJson);
      return responseJson;
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });

  // let endpoint = `updateTransfer.php?date=${date}&projectid=${project_id}&subProject=${sub_project}&account_name=${accountName}&category_name=${catName}&amount=${amount}&memo=${memo}&user_id=${userID}&expense_id=${expenseID}&userCode=${userCode}`;
  // console.log(endpoint);
  // return HttpClient.post(endpoint);
}
async function getCat() {
  let endpoint = `Income/get_category`;
  // console.log('...................getCat.........',endpoint);

  return HttpClient.post(endpoint);
}
async function getSubCat() {
  let endpoint = `Income/get_subcategory`;
  // console.log('...................getSubCat.........',endpoint);

  return HttpClient.post(endpoint);
}

function getAllDetails() {
  let endpoint = `get_tarnsaction_detail.php`;
  return HttpClient.post(endpoint);
}
function getMonthlyDetails(user_code) {
  let endpoint = `get_monthly_trans_details.php?user_code=${user_code}`;
  return HttpClient.post(endpoint);
}
function getcalendareData(id) {
  let endpoint = `get_calendare_details.php?user_code=${id}`;
  return HttpClient.post(endpoint);
}
function getcalendareDayData(id, day) {
  let endpoint = `get_calendare_day_details.php?user_code=${id}&day=${day}`;
  // console.log("calendar day===============================>", endpoint);
  return HttpClient.post(endpoint);
}
function getDayDetails(id, day, month, year) {
  let endpoint = `GetDetails/get_day_trans_details?cust_code=${id}&today_date=${year}-${
    month + 1
  }-${day}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}
function getTransferDetails(id, day, month, year,count) {
  let endpoint = `GetDetails/get_trans_details?cust_code=${id}&today_date=${year}-${
    month + 1
  }-${day}&count=${count}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}
function getTransferDetailsByDate(id, day, month, year) {
  let endpoint = `GetDetails/get_trans_details_byDate?cust_code=${id}&today_date=${year}-${
    month + 1
  }-${day}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}
function getTransferDetailsByOrder(id, day, month, year,order_id) {
  let endpoint = `GetDetails/get_trans_details_byOrder?cust_code=${id}&today_date=${year}-${
    month + 1
  }-${day}&order_id=${order_id}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}

function getUserList(id) {
  let endpoint = `GetDetails/get_all_user?user_code=${id}`;
  return HttpClient.post(endpoint);
}

async function getWeekContent(userCode) {
  let endpoint = `get_weekly_view.php?user_code=${userCode}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}

async function getMonthContent(userCode) {
  let endpoint = `get_monthly_view.php?user_code=${userCode}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}

function updatePass(oldP, newP, field, userCode) {
  let endpoint = `updatepassword.php?oldP=${oldP}&newP=${newP}&field=${field}&userCode=${userCode}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}

function removeTransfer(tarnsaction_id) {
  let endpoint = `Income/remove_transfer?transaction_id=${tarnsaction_id}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}

function removeExpense(tarnsaction_id) {
  let endpoint = `Expense/remove_expenses?transaction_id=${tarnsaction_id}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}

function removeIncome(tarnsaction_id) {
  let endpoint = `Income/remove_income?transaction_id=${tarnsaction_id}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}

function deletedTransDetails(cust_code) {
  let endpoint = `GetDetails/get_delete_trans_details?cust_code=${cust_code}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}
function createPayMethod(paymethod, user_code) {
  let endpoint = `add_pay_method.php?paymethod=${paymethod}&userCode=${user_code}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}
function getProject() {
  let endpoint = `Income/get_project`;
  return HttpClient.post(endpoint);
}

function getSubProject(user_code) {
  let endpoint = `Income/get_subproject?user_code=${user_code}`;
  return HttpClient.post(endpoint);
}
function getSubProjectList(id) {
  let endpoint = `GetDetails/get_sub_projet_list?parent_id=${id}`;
  return HttpClient.post(endpoint);
}
function getNewSubProjectList(id) {
  let endpoint = `GetDetails/get_new_sub_projet_list?parent_id=${id}`;
  return HttpClient.post(endpoint);
}
function getPayMethod() {
  let endpoint = `Income/getPayMethod`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}
function getVendorList(cat_id) {
  let endpoint = `GetDetails/get_vendor_list?catId=${cat_id}`;
  return HttpClient.post(endpoint);
}

function getAssignedProject(user_code) {
  let endpoint = `get_assigned_project_details.php?userCode=${user_code}`;
  // console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function getParentProjects() {
  let endpoint = `get_main_projects.php`;
  //console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function createProject(
  projectName,
  projectDescription,
  projectStartDate,
  projectEndDate,
  projectStatus,
  projectType,
  parentProjectId,
  user
) {
  let str = projectName;
  let projectsName = str.replace(/ /g, "_");

  let endpoint = `addProjects.php?name=${projectsName}&project_description=${projectDescription}&start_date=${projectStartDate}&end_date=${projectEndDate}&project_status=${projectStatus}&is_parent=${projectType}&parent_id=${parentProjectId}&createdby=${user}`;
  return HttpClient.post(endpoint);
}

async function getAllSubProjects() {
  let endpoint = `get_sub_projects.php`;
  //console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function getSubProjectsForReport(projectStatus) {
  let endpoint = `get_sub_projects_for_reports.php?project_status=${projectStatus}`;
  //console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function getSubProjectsForReportDateWise(newStartDate, newEndDate) {
  let endpoint = `get_sub_projects_for_reports_date_wise.php?start_date=${newStartDate}&end_date=${newEndDate}`;
  //console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function createVendor(vendorName, vendorStatus, parentCatId, user) {
  let str = vendorName;
  let vendorNames = str.replace(/ /g, "_");

  let endpoint = `addVendors.php?vendor_name=${vendorNames}&category_id=${parentCatId}&status=${vendorStatus}`;
  return HttpClient.post(endpoint);
}

async function createDepartment(
  departmentName,
  departmentStatus,
  departmentType,
  parentDepartmentId,
  user
) {
  let str = departmentName;
  let departmentNamee = str.replace(/ /g, "_");

  let endpoint = `addDepartment.php?departmentName=${departmentNamee}&departmentStatus=${departmentStatus}&departmentType=${departmentType}&parentDepartmentId=${parentDepartmentId}`;
  return HttpClient.post(endpoint);
}

async function updateDefaultProject(id, usercode) {
  let endpoint = `updateDefaultProject.php?project_id=${id}&user_code=${usercode}`;
  return HttpClient.post(endpoint);
}

async function getExpenseResult(projectName) {
  let endpoint = `get_expense_report.php?project_name=${projectName}`;
  return HttpClient.post(endpoint);
}

async function sendErrorDetails(name, message, error, fatal) {
  let endpoint = `add_crash_report.php?crash_name=${name}&crash_message=${message}&crash_details=${error}&is_fatal=${fatal}`;
  return HttpClient.post(endpoint);
}

async function getCatExpense() {
  let endpoint = `get_expense_cat.php`;
  //console.log(endpoint);
  return HttpClient.post(endpoint);
}

async function addEmployee(
  employeeRoll,
  employeeName,
  employeeNumber,
  employeeSalary,
  employeeSalaryDate,
  subproject_id,
  subproject_name,
  subdepartment_id,
  subdepartment_name,
  userCode
) {
  let endpoint = `saveEmployee.php?employeeRoll=${employeeRoll}&employeeName=${employeeName}&employeeNumber=${employeeNumber}&employeeSalary=${employeeSalary}
  &employeeSalaryDate=${employeeSalaryDate}&subproject_id=${subproject_id}&subproject_name=${subproject_name}
  &subdepartment_id=${subdepartment_id}&subdepartment_name=${subdepartment_name}&userCode=${userCode}`;
  return HttpClient.post(endpoint);
}

async function getTotalPendingSalary(departmentId = null) {
  let endpoint = `getTotalPendingSalary.php?id=${departmentId}`;
  return HttpClient.post(endpoint);
}

async function getAllEmployee(departmentId = null, subDepartmentID = null) {
  let endpoint = `getEmployeeList.php?id=${departmentId}&sub_department_id=${subDepartmentID}`;
  return HttpClient.post(endpoint);
}

async function getAllParentDepartment() {
  let endpoint = `getParentDepartmentList.php`;
  return HttpClient.post(endpoint);
}

async function getSubDepartmentForStaffDetails(departmentId = null) {
  let endpoint = `getSubDepartmentForStaffDetails.php?id=${departmentId}`;
  return HttpClient.post(endpoint);
}

async function getEmpDetails(employeeUID) {
  let endpoint = `getEmpDetails.php?uid=${employeeUID}`;
  return HttpClient.post(endpoint);
}

async function addOverTime(date, numberOfHours, amount, employeeUID, userCode) {
  let endpoint = `addEmployeeOverTimePayment.php?date=${date}&numberOfHours=${numberOfHours}&amountt=${amount}&emp_uid=${employeeUID}
  &userCode=${userCode}`;
  return HttpClient.post(endpoint);
}

async function addDeduction(
  date,
  purpose,
  amount,
  desc,
  employeeUID,
  userCode
) {
  let endpoint = `addDeduction.php?date=${date}&purpose=${purpose}&amount=${amount}&desc=${desc}&emp_uid=${employeeUID}&userCode=${userCode}`;
  return HttpClient.post(endpoint);
}

async function addAllowance(
  date,
  purpose,
  amount,
  desc,
  employeeUID,
  userCode
) {
  let endpoint = `addAllowance.php?date=${date}&purpose=${purpose}&amount=${amount}&desc=${desc}&emp_uid=${employeeUID}&userCode=${userCode}`;
  return HttpClient.post(endpoint);
}

async function addPayment(date, amount, desc, employeeUID, userCode) {
  let endpoint = `addEmployeePayment.php?date=${date}&amount=${amount}&desc=${desc}&emp_uid=${employeeUID}&userCode=${userCode}`;
  return HttpClient.post(endpoint);
}

async function addLoan(
  date,
  amount,
  desc,
  purpose,
  trans_type,
  employeeUID,
  userCode
) {
  let endpoint = `loan.php?date=${date}&amount=${amount}&desc=${desc}&purpose=${purpose}&trans_type=${trans_type}&emp_uid=${employeeUID}&userCode=${userCode}`;
  return HttpClient.post(endpoint);
}

async function getLoanDetails(employeeUID) {
  let endpoint = `getEmpLoanDetails.php?uid=${employeeUID}`;
  return HttpClient.post(endpoint);
}

async function getEmpAttandanceDetails(employeeUID, monthNumber) {
  let endpoint = `getEmpAttandance.php?uid=${employeeUID}&month_number=${
    monthNumber + 1
  }`;
  return HttpClient.post(endpoint);
}

async function getDepartment() {
  let endpoint = `get_subdepartment.php`;
  return HttpClient.post(endpoint);
}

async function setAccount(data) {
  return await Storage.set("account", data);
}

async function getAccount() {
  return await Storage.get("account");
}

/**
 * event as category and orders as sub category
 * 
 * @author Rahul Saha
 * date 14.02.23
 */

async function getCatnew() {
  let endpoint = `Income/get_categorys`;
  // console.log('...................getCatnew.........',endpoint);

  return HttpClient.post(endpoint);
}

/**
 * new wallet expense add
 * @author Rahul Saha
 * date 15.02.23
 */

async function wallet_expenseAdd(
  date,
  project_id,
  sub_project,
  accountName,
  Vendor_id,
  catName,
  amount,
  event,
  memo,
  imageURI,
  userCode,
  extraData_id,
  subproject_name
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("projectId", project_id);
  formData.append("sub_project", sub_project);
  formData.append("accountName", accountName);
  formData.append("VendorID", Vendor_id);
  formData.append("catName", catName);
  formData.append("amount", amount);
  formData.append("event", event);
  formData.append("memo", memo);
  formData.append("userCode", userCode);
  formData.append("extra_id", extraData_id);
  formData.append("event_details", subproject_name);

  if (imageURI != null) {
    //Add photo
    //this, retrive the file extension of photo
    const uriPart = imageURI.split(".");
    const fileExtension = uriPart[uriPart.length - 1];

    formData.append("image", {
      uri: imageURI,
      name: `trans.${fileExtension}`,
      type: `image/${fileExtension}`,
    });
  }
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "Wallet/wallet_expense_add", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) =>response.json())
    .then((responseJson) => {
     return responseJson;
     //console.log("response", responseJson);
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}

/**
 * get category for other expenses
 * 
 * @author Rahul Saha
 * date 24.02.23
 */

async function get_eventcategory() {
  let endpoint = `Income/get_eventcategory`;
  // console.log('...................getCatnew.........',endpoint);

  return HttpClient.post(endpoint);
}

async function event_expenseAdd(
  date,
  Amount_Type,
  catVal,
  amount,
  order_id,
  memo,
  imageURI,
  people,
  description
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("Amount_Type", Amount_Type);
  formData.append("catVal", catVal);
  formData.append("amount", amount);
  formData.append("order_id", order_id);
  formData.append("memo", memo);
  formData.append("imageURI", imageURI);
  formData.append("people", people);
  formData.append("description", description);

  if (imageURI != null) {
    //Add photo
    //this, retrive the file extension of photo
    const uriPart = imageURI.split(".");
    const fileExtension = uriPart[uriPart.length - 1];

    formData.append("image", {
      uri: imageURI,
      name: `trans.${fileExtension}`,
      type: `image/${fileExtension}`,
    });
  }
  console.log("Formdata", formData);
  // return
  //API that use fetch to input data to database via backend php script
  return await fetch(BASE_URL + "Income/event_expense_add", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      // console.log("response", responseJson);
      return responseJson;
      //console.log("response", responseJson);
      //this.props.navigation.navigate('seconde');
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}

/**
 * 
 * get event transfer details
 * @author Rahul Saha
 * date 27.02.23 
 * 
 */

function getEventTransferDetails(id,count) {
  let endpoint = `GetDetails/get_event_trans_details?order_id=${id}&count=${count}`;
  // console.log(endpoint)
  return HttpClient.post(endpoint);
}


async function payAmountAdd(
  date,
  user_code,
  description,
  amount,
  payOption,
  memo,
  document
) {
  const formData = new FormData();

  //Adding input data
  formData.append("date", date);
  formData.append("user_code", user_code);
  formData.append("description", description);
  formData.append("amount", amount);
  formData.append("payOption", payOption);
  formData.append("memo", memo);
  formData.append("document", document); 

  console.log('...formData.....',formData)

  return await fetch(BASE_URL + "wallet/add_payment_amount", {
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson;
    })
    .catch((error) => {
      console.error("Error==============>", error);
      var errMsg = "Failed";
      return errMsg;
    });
}


async function logout() {
  return await Storage.set("account", null);
  //console.log("logout");
}

export default {
  login,
  mpinlogin,
  register,
  setAccount,
  getAccount,
  logout,
  retriveAccount,
  expenseAdd,
  incomeAdd,
  getCat,
  getSubCat,
  getAllDetails,
  getMonthlyDetails,
  getDayDetails,
  getTransferDetails,
  getTransferDetailsByDate,
  getTransferDetailsByOrder,
  expenseUpdate,
  incomeUpdate,
  getWeekContent,
  getMonthContent,
  getcalendareData,
  getcalendareDayData,
  getUserList,
  addTransfer,
  updateTransfer,
  updateAccount,
  updatePass,
  updateProfilePic,
  fetchDetailsAccounts,
  fetchAccountAllDetails,
  getParentCat,
  createCat,
  removeTransfer,
  removeExpense,
  removeIncome,
  deletedTransDetails,
  getProject,
  getAssignedProject,
  getVendorList,
  createPayMethod,
  getPayMethod,
  getSubProject,
  getSubProjectList,
  getNewSubProjectList,
  getParentProjects,
  createProject,
  getCatExpense,
  createVendor,
  getAllSubProjects,
  updateDefaultProject,
  getSubProjectsForReport,
  getExpenseResult,
  getSubProjectsForReportDateWise,
  sendErrorDetails,
  addEmployee,
  getTotalPendingSalary,
  getAllEmployee,
  getEmpDetails,
  addOverTime,
  addDeduction,
  addAllowance,
  addPayment,
  addLoan,
  getLoanDetails,
  getEmpAttandanceDetails,
  getDepartment,
  getAllParentDepartment,
  getSubDepartmentForStaffDetails,
  createDepartment,
  getCatnew,
  wallet_expenseAdd,
  get_eventcategory,
  event_expenseAdd,
  getEventTransferDetails,
  payAmountAdd
};
