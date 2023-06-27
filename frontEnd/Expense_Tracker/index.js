var amount=document.getElementById('amount');
var desc=document.getElementById('desc');
var cat=document.getElementById('cat');
var addExpenseForm=document.getElementById('addProduct');
var addExpense_dest=document.getElementById('addExpense_dest');
var buyPremiumButton=document.getElementById('buyPremiumButton');
var premium_user_dest=document.getElementById('premium_user_dest');
var leaderboard_btn=document.getElementById('show-leaderboard-btn');
var leaderboard=document.getElementById('leaderboard');
var leaderboard_item=document.getElementById('liaderboard_item');
var view_report_btn=document.getElementById('view-report-btn');
var expense_analysis_button_group=document.getElementById('expense-analyse-button-group');
var daily_expense_btn=document.getElementById('daily-expense-btn');
var weekly_expense_btn=document.getElementById('weekly-expense-btn');
var monthly_expense_btn=document.getElementById('monthly-expense-btn');
var expense_analysis_ifrme=document.getElementById('iframe');
var download_report_button=document.getElementById('download-report-btn');

//listing all the expenses on load
window.addEventListener('DOMContentLoaded',async ()=>{
    try{
        let result=await axios.get('http://localhost:3000/expense/getExpenses',{headers:{token:localStorage.getItem("token")}});
        //removind buy premium button for premium user
        if(result.data.isPremiumUser){
            premiumFeatures();
        }
        for(let expense of result.data.expenses){
            displayExpense(expense);
        }
    }
    catch(err){};
})

//add expense
addExpenseForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    var obj={
        expenseAmount:amount.value,
        description:desc.value,
        category:cat.value
    }
    try{
        const result=await axios.post('http://localhost:3000/expense/addExpense',obj,{headers:{token:localStorage.getItem("token")}});
        obj.id=result.data.id;
        displayExpense(obj);
        //refresh leaderboard if only premium user
        if(result.data.premium){
            showLeaderBoard();
        }
        
    }
    catch(err){
        console.log(err.message);
    }
})

//display expense
function displayExpense(obj){
    // console.log(obj);
    var text=obj.expenseAmount+' - '+obj.description+' - '+obj.category;
    var newEle=document.createElement('li');
    var textNode=document.createTextNode(text);
    newEle.appendChild(textNode);
    //delete expense button
    var deleteButton=document.createElement('button');
    deleteButton.textContent="Delete Expense";
    deleteButton.className="delete";
    deleteButton.setAttribute('data-id',obj.id);
    newEle.appendChild(deleteButton);
    //displaying to the screen
    addExpense_dest.appendChild(newEle);
    addExpenseForm.reset();
}

//delete expense
addExpense_dest.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('delete')){
        try{
            let expense=await axios.delete('http://localhost:3000/expense/deleteExpense/'+e.target.dataset.id,{headers:{token:localStorage.getItem("token")}});
            e.target.parentElement.remove();
            console.log(expense);
            //refresh leaderboard
            showLeaderBoard();
        }
        catch(err){
            console.log(err.message);
        }
    }
})

//buy premium
buyPremiumButton.addEventListener('click',async (e)=>{
    const response=await axios.get('http://localhost:3000/purchase/purchase-premium',{headers:{token:localStorage.getItem("token")}});
    // console.log(response.data);
    var option={
        "key":response.data.key_id,
        "order_id":response.data.order_id,
        "handler": async function(response1){
            try{
                await axios.post('http://localhost:3000/purchase/update-premium',{order_id:option.order_id,payment_id:response1.razorpay_payment_id},{headers:{token:localStorage.getItem("token")}});
                alert("now you are premium user");
                //removing buy premium button 
                premiumFeatures();
                
            }
            catch(err){
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

    const rzp=new Razorpay(option);

    //this is the method to call razorpay frontend
    rzp.open(); 

    rzp.on('payment.failed',(response)=>{
        console.log(response);
        alert("something went wrong")
    })
})

function premiumFeatures(){
    buyPremiumButton.remove();
    premium_user_dest.textContent='You are a premium user';
    leaderboard_btn.removeAttribute('hidden');
    view_report_btn.removeAttribute('hidden');
    expense_analysis_button_group.removeAttribute('hidden');

}

//download report
download_report_button.addEventListener('click',async ()=>{
    try{
        const response=await axios.get('http://localhost:3000/user/download-report',{headers:{token:localStorage.getItem('token')}});
        const fileURL=response.data.fileURL;
        console.log(fileURL);
        var a=document.createElement('a');
        a.href=fileURL;
        //set name of the downloadad file
        a.download='Expense-Tracker-App-Report.txt';
        //trigger the click event programatically
        a.click();
    }
    catch(err){
        alert(err.response.data.message);

    }
});

//leaderboard
leaderboard_btn.addEventListener('click',showLeaderBoard)

async function showLeaderBoard (){
    leaderboard.removeAttribute('hidden');
    try{
        const leaderBoards_items=await axios.get('http://localhost:3000/premium/showLeaderBoard',{headers:{token:localStorage.getItem('token')}});
        // console.log(leaderBoards_items);
        leaderboard_item.innerHTML="";
        for(let item of leaderBoards_items.data){
            addLeaderBoardItem(item);
        }
    }
    catch(err){
        console.log(err);
    }

}

function addLeaderBoardItem(obj){
    let text='Name - '+obj.name+" - Total Expenses - "+obj.totalExpenses;
    var textNode=document.createTextNode(text);
    var newEle=document.createElement('li');
    newEle.appendChild(textNode);
    leaderboard_item.appendChild(newEle);
}

//view report
view_report_btn.addEventListener('click',()=>{
    window.location.href='../Expense_Report/report.html'
})

//expense analysis
daily_expense_btn.onclick=()=>{
    console.log('click');
    expense_analysis_ifrme.setAttribute('src','../Daily_Expense_Analysis/dailyExpenseAnalysis.html');
}
weekly_expense_btn.onclick=()=>{
    expense_analysis_ifrme.setAttribute('src','../Weekly_Expense_Analysis/weeklyExpenseAnalysis.html');
}
monthly_expense_btn.onclick=()=>{
    expense_analysis_ifrme.setAttribute('src','../Monthly_Expense_Analysis/monthlyExpenseAnalysis.html');
}