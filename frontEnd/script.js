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
var buyPremiumButton=document.getElementById('buyPremiumButton');

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
                localStorage.setItem('token',result.data.token);
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
            const result=await axios.post('http://localhost:3000/expense/addExpense',obj,{headers:{token:localStorage.getItem("token")}});
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
            let result=await axios.get('http://localhost:3000/expense/getExpenses',{headers:{token:localStorage.getItem("token")}});
            //removind buy premium button for premium user
            if(result.data.isPremiumUser){buyPremiumButton.remove();}
            for(let expense of result.data.expenses){
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
            let expense=await axios.delete('http://localhost:3000/expense/deleteExpense/'+e.target.dataset.id,{headers:{token:localStorage.getItem("token")}});
            console.log(expense);
        }
        catch(err){
            console.log(err.message);
        }
    }
}) 
//buy premium
try{
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
                    buyPremiumButton.remove();
                }
                catch(err){
                    console.log(err.message);
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
        
        rzp.open(); //this is the method to call razorpay frontend

        // e.preventDefault();// it is necessary if button is of type submit

        rzp.on('payment.failed',(response)=>{
            console.log(response);
            alert("something went wrong")
        })
    })
}
catch(err){};

