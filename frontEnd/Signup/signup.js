var uname=document.getElementById('name');
var email=document.getElementById('email');
var password=document.getElementById('password');
var SignupForm=document.getElementById('frm');
var dest=document.getElementById('dest');

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

function showMessage(msg,color){
    dest.innerText=msg;
    dest.style.color=color;
    setTimeout(() => {
        dest.innerText='';   
    }, 2000);
}