var uname=document.getElementById('name');
var email=document.getElementById('email');
var password=document.getElementById('password');
var loginForm=document.getElementById('loginForm');
var dest=document.getElementById('dest');
var forgetPasswordBtn=document.getElementById('forgetPasswordBtn');
var forgetPasswordForm=document.getElementById('forgetPasswordForm');
var dialog=document.getElementById('dialog');
var resetEmail=document.getElementById('yourEmail');

loginForm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    var loginObj={
        email:email.value,
        password:password.value
    };
    console.log(loginObj);
    try{
        const result=await axios.post(`http://35.170.186.129:3000/user/login`,loginObj)
        // console.log(result);
        if(result.data.success==="false"){
            showMessage('password wrong','red');
        }else if(result.data.success==="true"){
            showMessage(result.data.message,'green');
            localStorage.setItem('token',result.data.token);
            window.location.href = '../Expense_Tracker/index.html';
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

function showMessage(msg,color){
    dest.innerText=msg;
    dest.style.color=color;
    setTimeout(() => {
        dest.innerText='';   
    }, 2000);
}

//showing dialog box for taking email
forgetPasswordBtn.addEventListener('click',()=>{
    dialog.style.display='block';
});
forgetPasswordForm.addEventListener('submit',async(e)=>{
    e.preventDefault();
    dialog.style.display='none';
    let obj={
        resetEmail:resetEmail.value
    }
    try{
        //sending request to server to send reset link to given email id if user exist
        const result=await axios.post(`http://35.170.186.129:3000/password/reset-password`,obj);
        alert(result.data.message);
    }
    catch(err){
        console.log(err);
    }
})