var amount = document.getElementById('amount');
var desc = document.getElementById('desc');
var cat = document.getElementById('cat');
var addExpenseForm = document.getElementById('addProduct');
var addExpense_dest = document.getElementById('addExpense_dest');
var buyPremiumButton = document.getElementById('buyPremiumButton');
var premium_user_dest = document.getElementById('premium_user_dest');
var leaderboard_btn = document.getElementById('show-leaderboard-btn');
var leaderboard = document.getElementById('leaderboard');
var leaderboard_item = document.getElementById('liaderboard_item');
var view_report_btn = document.getElementById('view-report-btn');
var expense_analysis_button_group = document.getElementById('expense-analyse-button-group');
var daily_expense_btn = document.getElementById('daily-expense-btn');
var weekly_expense_btn = document.getElementById('weekly-expense-btn');
var monthly_expense_btn = document.getElementById('monthly-expense-btn');
var expense_analysis_ifrme = document.getElementById('iframe');
var download_report_button = document.getElementById('download-report-btn');
var reports_dest = document.getElementById('reports_dest');
var paginationButtonHolder=document.getElementById('paginationButtonHolder');
var pagination_btn=document.getElementById('pagination-btn');

//listing all the expenses on load
window.addEventListener('DOMContentLoaded', async () => {
    try {
        listExpenses(1);
        let allExpenseReport = await axios.get(`http://34.228.46.44:3000/user/getExpenseReports`, { headers: { token: localStorage.getItem('token') } });
        // console.log(allExpenseReport.data);
        if (allExpenseReport.data.ispremiumuser) {
            premiumFeatures();
        }
        for (let report of allExpenseReport.data.reports) {
            displayExpenseReport(report);
        }
    }
    catch (err) {
        console.log(err);
    };
})

async function listExpenses(page){
    // console.log(page);
    let result = await axios.get(`http://34.228.46.44:3000/expense/getExpenses?page=${page}&rows_per_page=${Number(localStorage.getItem('UserPreference_page_size'))}`, { headers: { token: localStorage.getItem("token") } });
        //removing buy premium button for premium user
        // console.log(result);
        addExpense_dest.innerHTML="";
        for (let expense of result.data.expenses) {
            displayExpense(expense);
        }
        //show buttons
        pagination(result.data);
}

function pagination(data){
    // console.log(data);
    // if(data.expenses.length==0) return;
    pagination_btn.innerHTML="";
    let newEle=document.createElement('div');
    //row per page
    let label=document.createElement('label');
    label.setAttribute('for','rowsNumberSelector');
    label.textContent="Rows per page:"
    let select=document.createElement('select');
    select.setAttribute('id','rowsNumberSelector');
    select.addEventListener('change',(e)=>{setUserPreferenceForPageSize(e);})
    let op0=document.createElement('option');
    op0.textContent="select";
    let userPreference_pagesize=localStorage.getItem('UserPreference_page_size')
    if(userPreference_pagesize){
        op0.textContent='prefered:'+userPreference_pagesize;
    }else{
        op0.textContent="select";
    }
    let op1=document.createElement('option');
    op1.textContent="5";
    op1.value=5;
    let op2=document.createElement('option');
    op2.textContent="10";
    op2.value=10;
    let op3=document.createElement('option');
    op3.textContent="25";
    op3.value=25;
    let op4=document.createElement('option');
    op4.textContent="50";
    op4.value=50;
    let op5=document.createElement('option');
    op5.textContent="100";
    op5.value=100;
    select.append(op0,op1,op2,op3,op4,op5);
    pagination_btn.append(label,select);

    //pagination button
    newEle.setAttribute('id',"paginationButtonHolder");
    if(data.hasPrevious){
        let btn1=document.createElement('button');
        btn1.textContent=data.previousPage;
        btn1.addEventListener('click',()=>{listExpenses(data.previousPage)});
        newEle.appendChild(btn1);
    }
    
    let btn2=document.createElement('button');
    btn2.textContent=data.currentPage;
    btn2.addEventListener('click',()=>{listExpenses(data.currentPage)});
    newEle.appendChild(btn2);
    
    if(data.hasNext){
        let btn3=document.createElement('button');
        btn3.textContent=data.nextPage;
        btn3.addEventListener('click',()=>{listExpenses(data.nextPage)});
        newEle.appendChild(btn3);

    }
    pagination_btn.appendChild(newEle);
}

function setUserPreferenceForPageSize(e){
    localStorage.setItem('UserPreference_page_size',e.target.value);
    // console.log(e.target.value);
    listExpenses(1);
}

//add expense
var flag=false;
addExpenseForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    var obj = {
        expenseAmount: amount.value,
        description: desc.value,
        category: cat.value
    }
    try {
        const result = await axios.post(`http://34.228.46.44:3000/expense/addExpense`, obj, { headers: { token: localStorage.getItem("token") } });
        const paginationLimit=localStorage.getItem('UserPreference_page_size');
        const numberOfExpenses=result.data.numberOfExpense-1;
        // console.log(result);
        //limiting the size in pagination
        if(numberOfExpenses<paginationLimit || !paginationLimit){
            obj.id = result.data.id;
            
            displayExpense(obj);
            flag=true;
        }else if(flag){
            //updating the pagination button
            listExpenses(1);
            flag=false;
        }
        addExpenseForm.reset();
        //refresh leaderboard if only premium user
        if (result.data.premium) {
            showLeaderBoard();
        }

    }
    catch (err) {
        console.log(err.message);
    }
})

//display expense
function displayExpense(obj) {
    // console.log(obj);
    var text = obj.expenseAmount + ' - ' + obj.description + ' - ' + obj.category;
    var newEle = document.createElement('li');
    var textNode = document.createTextNode(text);
    newEle.appendChild(textNode);
    //delete expense button
    var deleteButton = document.createElement('button');
    deleteButton.textContent = "Delete Expense";
    deleteButton.className = "delete";
    deleteButton.setAttribute('data-id', obj.id);
    newEle.appendChild(deleteButton);
    //displaying to the screen
    addExpense_dest.appendChild(newEle);
    addExpenseForm.reset();
}

//display expense reports
function displayExpenseReport(report) {
    //createdAt//report
    // console.log(report);
    let tr = document.createElement('tr');
    let td1 = document.createElement('td');
    let td2 = document.createElement('td');
    let date = new Date(report.createdAt);
    td1.textContent = date.toLocaleDateString();
    let a = document.createElement('a');
    a.textContent = report.reports;
    a.href = report.reports;
    td2.appendChild(a);
    tr.append(td1, td2);
    reports_dest.appendChild(tr);
}

//delete expense
addExpense_dest.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete')) {
        try {
            let expense = await axios.delete(`http://34.228.46.44:3000/expense/deleteExpense/` + e.target.dataset.id, { headers: { token: localStorage.getItem("token") } });
            e.target.parentElement.remove();
            // console.log(expense);
            //refresh page of pagination
            listExpenses(1);
            //refresh leaderboard
            if(expense.data.ispremiumuser){
                showLeaderBoard();
            }
        }
        catch (err) {
            console.log(err.message);
        }
    }
})

//buy premium
buyPremiumButton.addEventListener('click', async (e) => {
    const response = await axios.get(`http://34.228.46.44:3000/purchase/purchase-premium`, { headers: { token: localStorage.getItem("token") } });
    // console.log(response.data);
    var option = {
        "key": response.data.key_id,
        "order_id": response.data.order_id,
        "handler": async function (response1) {
            try {
                await axios.post(`http://34.228.46.44:3000/purchase/update-premium`, { order_id: option.order_id, payment_id: response1.razorpay_payment_id }, { headers: { token: localStorage.getItem("token") } });
                alert("now you are premium user");
                //removing buy premium button 
                premiumFeatures();

            }
            catch (err) {
                console.log(err);
            }
        }
        // ,
        // prefill:{
        //     name:"Akshay Kumar sah",
        //     constact:"1234567890",
        //     email:"shahaxay34@gmail.com"
        // },
        // receipt:"receipt#1",
        // notes:{
        //     date:"today",
        //     time:'evening'
        // }
    }

    const rzp = new Razorpay(option);

    //this is the method to call razorpay frontend
    rzp.open();

    rzp.on('payment.failed', (response) => {
        // console.log(response);
        alert("something went wrong")
    })
})

function premiumFeatures() {
    buyPremiumButton.remove();
    premium_user_dest.textContent = 'You are a premium user';
    const elements = [leaderboard_btn, view_report_btn, expense_analysis_button_group, reports_dest];
    elements.forEach(element => element.removeAttribute('hidden'));
}

//download report
download_report_button.addEventListener('click', async () => {
    try {
        const response = await axios.get(`http://34.228.46.44:3000/user/download-report`, { headers: { token: localStorage.getItem('token') } });
        const fileURL = response.data.fileURL;
        // console.log(fileURL);
        var a = document.createElement('a');
        a.href = fileURL;
        //set name of the downloadad file
        a.download = 'Expense-Tracker-App-Report.txt';
        //trigger the click event programatically
        a.click();
        displayExpenseReport({ createdAt: new Date(), reports: fileURL });
    }
    catch (err) {
        alert(err.response.data.message);

    }
});

//leaderboard
leaderboard_btn.addEventListener('click', showLeaderBoard)

async function showLeaderBoard() {
    leaderboard.removeAttribute('hidden');
    try {
        const leaderBoards_items = await axios.get(`http://34.228.46.44:3000/premium/showLeaderBoard`, { headers: { token: localStorage.getItem('token') } });
        // console.log(leaderBoards_items);
        leaderboard_item.innerHTML = "";
        for (let item of leaderBoards_items.data) {
            addLeaderBoardItem(item);
        }
    }
    catch (err) {
        console.log(err);
    }

}

function addLeaderBoardItem(obj) {
    let text = 'Name - ' + obj.name + " - Total Expenses - " + obj.totalExpenses;
    var textNode = document.createTextNode(text);
    var newEle = document.createElement('li');
    newEle.appendChild(textNode);
    leaderboard_item.appendChild(newEle);
}

//view report
view_report_btn.addEventListener('click', () => {
    window.location.href = '../Expense_Report/report.html'
})

//expense analysis
daily_expense_btn.onclick = () => {
    // console.log('click');
    expense_analysis_ifrme.setAttribute('src', '../Daily_Expense_Analysis/dailyExpenseAnalysis.html');
}
weekly_expense_btn.onclick = () => {
    expense_analysis_ifrme.setAttribute('src', '../Weekly_Expense_Analysis/weeklyExpenseAnalysis.html');
}
monthly_expense_btn.onclick = () => {
    expense_analysis_ifrme.setAttribute('src', '../Monthly_Expense_Analysis/monthlyExpenseAnalysis.html');
}