// fulse for https://ehostingguru.com/stage/funtoo/
const PRODUCTION = false;
const END_POINT = PRODUCTION
  ? //  "https://funtoo.invoice2day.in/"
  "https://funworks.in/"
  // "https://funworks.in/funtootest/"
  : "https://funworks.in/funtootest/"
  // : "https://ehostingguru.com/stage/funtoo/"
  ;
export default {
  PRODUCTION: PRODUCTION,
  BASE_URL: `${END_POINT}api/`,
  SUCCESS_TYPE: "success",
  FAILURE_TYPE: "failure",
  TIMER_VALUE: 60,
  PHONE_NUMBER_COUNTRY_CODE: "+91",
  GENDERS: ["Male", "Female", "Others"],
  STATUS_ONBOARDING: "onboarding",
  STATUS_APPROVED: "approved",
  STATUS_BANNED: "banned",
  UPLOAD_PATH: `${END_POINT}uploads/files/`,
  CASHFLOW_PATH: `${END_POINT}api/CashFlow/`,
  IMAGE_URL: `${END_POINT}uploads/images/`,
  SLIDER_URL: `${END_POINT}uploads/slider/`,
  NEW_COLLECTION_URL: `${END_POINT}uploads/game/`,
  CATEGORY_IMAGE_URL: `${END_POINT}uploads/category/`,
  SUB_CATEGORY_IMAGE_URL: `${END_POINT}uploads/game/`,
  GAME_GALLERY_IMAGE_URL: `${END_POINT}uploads/gameimage/`,
  EMPLOYEE_DOC: `${END_POINT}uploads/employee_doc/`,
  GAME_PARTS_URL: `${END_POINT}uploads/game_parts/`,
  VEHICAL_IMAGE: `${END_POINT}api/uploads/images/`,

  //.......... Zoo task...............
  PROFILE_URL: END_POINT + "upload/images/",
  ignoreWarnings: true,
  BASE_URL: END_POINT + "api/",
  BASE_URL_APP: END_POINT + "app/",
  TASK_URL: `${END_POINT}api/admin/tasks/`,
  IMAGE_URL: END_POINT,
  DOCUMENT_URL: `${END_POINT}api/uploads/documents/`,
  INVENTORY_MGMT_BASE: END_POINT + "app/inventory/",
  USER_MGMT_BASE: END_POINT + "app/user_mgmt/",
  MEDICAL_INCIDENT_BASE: END_POINT + "app/MedicalAndIncidentReport/",
  MEDICAL_RECORD_UPLOAD_DATA_URL: END_POINT + "upload/medical_records/",
  INCIDENT_RECORD_UPLOAD_DATA_URL: END_POINT + "upload/incident_records/",
  WORK_ALLOCATION: END_POINT + "app/workallocation/",
  REPORTS_MGMT_BASE: END_POINT + "app/reports/",
  MAIL: END_POINT + "app/sendMail",
  GOOGLE_PLACE_API_KEY: "AIzaSyAHG9wJDJThFRp7aZdG9O2LMRvSRXjjois",
  SUCCESS_TYPE: "success",
  FAILURE_TYPE: "failure",
  //......................
  MANAGE_ORDER_TABS: [
    { id: "Event Details", name: "Event Details", icon_name: "calendar-o", iconTag: "FontAwesome" },
    // { id: "List", name: "List", icon_name: "list", iconTag: "FontAwesome" },
    {
      id: "StaffAssignment",
      name: "StaffAssignment",
      icon_name: "md-person-add-sharp",
      iconTag: "Ionicons",
    },
    {
      id: "Volunteers",
      name: "Volunteers",
      icon_name: "roman-numeral-5",
      iconTag: "MaterialCommunityIcons",
    },
    {
      id: "Transport",
      name: "Transport",
      icon_name: "truck",
      iconTag: "FontAwesome",
    },
    // {id: "Tracking", name:"Tracking", icon_name:"location-sharp",iconTag:"Ionicons"},
    {
      id: "Accounting",
      name: "Accounting",
      icon_name: "account-balance",
      iconTag: "MaterialIcons",
    },
    { id: "Communications", name: "Communications", icon_name: "call", iconTag: "Ionicons" },
    { id: "List", name: "List", icon_name: "list", iconTag: "FontAwesome" },
    {
      id: "EventExpenses",
      name: "EventExpenses",
      icon_name: "account-balance-wallet",
      iconTag: "MaterialIcons",
    },
    {
      id: "OtherExpenses",
      name: "OtherExpenses",
      icon_name: "account-balance-wallet",
      iconTag: "MaterialIcons",
    },
    // { id: "Call", name: "Call", icon_name: "call", iconTag: "Ionicons" },
    // {id: "Communications", name:"Communications", icon_name:"call",iconTag:"Ionicons"},
  ],
  GOOGLE_PLACE_API_KEY: "AIzaSyAHG9wJDJThFRp7aZdG9O2LMRvSRXjjois",
  USER_ACTION_TYPES: [
    { id: "Add", name: "Add" },
    { id: "Edit", name: "Edit" },
    { id: "Delete", name: "Delete" },
    { id: "View", name: "View" },
    // { id: "Stats", name: "Statistic" },
  ],
  CashFlowTab: [
    {
      id: "Income",
      name: "Income"
    },
    {
      id: "Expense",
      name: "Expense"
    },
    {
      id: "Transfer",
      name: "Transfer"
    },
    // {
    //   id: "Wallet",
    //   name: "Wallet"
    // }
  ],
  HOME_SCREEN_MENUES: [
    {
      id: "Catalog",
      name: "Catalog",
      component: "Catalog",
      options: "Catalogue",
      iconName: "book",
      iconTag: "ionicons",
    },
    {
      id: "Address_Book",
      name: "Address Book",
      component: "Address_Book",
      options: "Address Book",
      iconTag: "materialCommunityIcons",
      iconName: "badge-account-horizontal-outline",
    },
    {
      id: "ManageEnquiry",
      name: "ManageEnquiry",
      component: "ManageEnquiry",
      options: "Manage Enquiry",
      iconName: "clipboard-list",
      iconTag: "materialCommunityIcons",
    },
    {
      id: "Orders",
      name: "Orders",
      component: "Orders",
      options: "Manage Orders",
      iconName: "calendar-clock",
      iconTag: "materialCommunityIcons",
    },
    {
      id: "Task",
      name: "Task",
      component: "Todo",
      options: "Todo",
      iconName: "calendar-clock",
      iconTag: "materialCommunityIcons",
    },
    {
      id: "Billing",
      name: "Billing",
      component: "ManageBill",
      options: "Billing",
      iconName: "receipt",
      iconTag: "ionicons",
    },
    {
      id: "PaymentScreen",
      name: "Payment",
      component: "PaymentScreen",
      options: "Payment",
      iconName: "money",
      iconTag: "fontAwesome",
    },
    {
      id: "Employee",
      name: "Employee",
      component: "Employee",
      options: "Employee",
      iconName: "user",
      iconTag: "fontAwesome",
    },
    {
      id: "MasterMenuScreen",
      name: "Master",
      component: "MasterMenuScreen",
      options: "Masters",
      iconTag: "fontAwesome",
      iconName: "cog",
    },
    {
      id: 'CashFlow',
      name: "Cash",
      component: 'CashFlow',
      options: "Cash",
      iconTag: "MaterialCommunityIcons",
      iconName: "cash-fast",

    },
    {
      id: 'Bank_Details',
      name: "Bank Details",
      component: 'Bank_Details',
      options: "Bank Details",
      iconTag: "MaterialCommunityIcons",
      iconName: "bank",

    },
    {
      id: "Wishlist_Suggestion",
      name: "Wishlist Suggestion",
      component: "Wishlist_Suggestion",
      options: "Wishlist Suggestion",
      iconTag: "Ionicons",
      iconName: "cart-outline",
    },
    {
      id: "Log_history",
      name: "Log History",
      component: "Log_history",
      options: "Log history",
      iconTag: "fontAwesome",
      iconName: "history",
    },
    {
      id: 'WalletCashFlow',
      name: "Wallet",
      component: 'WalletCashFlow',
      options: "Wallet",
      iconTag: "Ionicons",
      iconName: "wallet",

    },
  ],
  TAB_MENU: [
    {
      id: "Address_Book",
      name: "Address",
      component: "Address_Book",
    },
    {
      id: "Log_history",
      name: "Log History",
      component: "Log_history",
    },
  ],
  Home_TAB: [
    {
      id: "Orders",
      name: "Order",
    },
    {
      id: "ManageEnquiry",
      name: "Enquiry",
    },

  ],
  TASK_STATUS: {
    pending: "Pending",
    approved: "Approved",
    waiting: "Waiting for approval",
    completed: "Completed",
    rejected: "Rejected",
  },
  USER_ORDER_DETAILS: [
    { id: "Event Details", name: "Event Details" },
    { id: "List", name: "List" },
    { id: "Volunteers", name: "Volunteers" },
    { id: "Transport", name: "Transport" },
    // { id: "Tracking", name: "Tracking" },
    { id: "Accounting", name: "Accounting" },
    { id: "Communications", name: "Communications" },
    { id: "Call", name: "Call" },
    { id: "StaffAssignment", name: "StaffAssignment" },
  ],

  /*
   *
   * cashflow component list
   * created by- Rahul Saha
   * created on- 23.11.22
   *
   */

  CashFlow_Details: [
    {
      id: "Income",
      name: "Income",
      component: "Income",
      iconName: "wallet-plus-outline",
      icon: "MaterialCommunityIcons",
    },
    {
      id: "Expense",
      name: "Expense",
      component: "Expense",
      iconName: "wallet",
      icon: "SimpleLineIcons",
    },
    {
      id: "AccountDetailsScreen",
      name: "History",
      component: "AccountDetailsScreen",
      iconName: "swap-horizontal",
      icon: "MaterialCommunityIcons",
    },
    {
      id: "AccountDetailsScreen",
      name: "Home",
      component: "HomeScreen",
      iconName: "home",
      icon: "MaterialCommunityIcons",
    },
  ],

  ofcLat_Lng: {
    lat: 13.09729,
    lng: 77.61851,
  },
  ASSIGN_TYPE: [
    { value: "delicate", label: "Delicate" },
    { value: "permanent", label: "Permanent" },
  ],
  TASK_TYPE: [
    { value: "all", label: "All Tasks" },
    { value: "selected", label: "Selected Tasks" },
  ],
};

export function ToFormData(obj) {
  let formdata = new FormData();
  for (let key in obj) {
    formdata.append(key, obj[key]);
  }
  return formdata;
}

export function BuildSeachParams(obj) {
  let searchParams = new URLSearchParams(obj);

  return searchParams.toString();
}
