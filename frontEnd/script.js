var uname=document.getElementById('name');
var email=document.getElementById('email');
var password=document.getElementById('password');
var SignupForm=document.getElementById('frm');
var loginForm=document.getElementById('loginForm');
var dest=document.getElementById('dest');
//index page
var amount=document.getElementById('amount');
var desc=document.getElementById('desc');
var cat=document.getElementById('cat');
var addExpenseForm=document.getElementById('addProduct');
var addProduct_dest=document.getElementById('addProduct_dest');

//signup form
try{
    SignupForm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        var signupObj={
            name:uname.value,
            email:email.value,
            password:password.value
        };
        try{
            const result=await axios.post("http://localhost:3000/user/signup",signupObj)
            if(result.status==200){
                showMessage("Your acount Created Successfully",'green');
                SignupForm.reset();
            }
        }catch(err){
            showMessage(err.response.data.message,'red');
            // console.log(err.response.status);
        }
    })
}
catch(err){};

//login form
try{
    loginForm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        var loginObj={
            email:email.value,
            password:password.value
        };
        console.log(loginObj);
        try{
            const result=await axios.post("http://localhost:3000/user/login",loginObj)
            // console.log(result);
            if(result.data.success==="false"){
                showMessage('password wrong','red');
            }else if(result.data.success==="true"){
                showMessage(result.data.message,'green');
                window.location.href = './index.html';
            }
        }catch(err){
            const res=err.response;
            if(res.status==401){
                showMessage(res.data.message,'red');
            }else if(res.status==404){
                showMessage(res.data.message,'red');
            }else{
                console.log(err.message);
            }
        }
    })
}
catch(err){}

function showMessage(msg,color){
    dest.innerText=msg;
    dest.style.color=color;
    setTimeout(() => {
        dest.innerText='';   
    }, 2000);
}

//add expense
try{
    addExpenseForm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        var obj={
            expenseAmount:amount.value,
            description:desc.value,
            category:cat.value
        }
        try{
            const result=await axios.post('http://localhost:3000/expense/addExpense',obj);
            obj.id=result.data.id;
            displayExpense(obj);
        }
        catch(err){
            console.log(err.message);
        }
    })
}catch(err){}

//display expense
function displayExpense(obj){
    // console.log(obj);
    var text=obj.expenseAmount+' - '+obj.description+' '+obj.category;
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
    addProduct_dest.appendChild(newEle);
    addExpenseForm.reset();
}

try{
    window.addEventListener('DOMContentLoaded',async ()=>{
        try{
            let expenseArray=await axios.get('http://localhost:3000/expense/getExpenses');
            // console.log(expenseArray);
            for(let expense of expenseArray.data){
                displayExpense(expense);
            }
        }
        catch(err){};
    })
}
catch(err){};

//delete expense
addProduct_dest.addEventListener('click',async(e)=>{
    if(e.target.classList.contains('delete')){
        try{
            e.target.parentElement.remove();
            let expense=await axios.delete('http://localhost:3000/expense/deleteExpense/'+e.target.dataset.id);
            console.log(expense);
        }
        catch(err){
            console.log(err.message);
        }
    }
}) 


