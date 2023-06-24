var uname=document.getElementById('name');
var email=document.getElementById('email');
var password=document.getElementById('password');
var frm=document.getElementById('frm');
var loginForm=document.getElementById('loginForm');
var dest=document.getElementById('dest');
console.log(document);
try{
    frm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        var signupObj={
            name:uname.value,
            email:email.value,
            password:password.value
        };
        try{
            const result=await axios.post("http://localhost:3000/user/signup",signupObj)
            console.log(result.status);
        }catch(err){
            dest.innerText='email already exists';
            dest.style.color='red';
            setTimeout(() => {
                dest.innerText='';   
            }, 2000);
            console.log(err);
        }
    })
}
catch(err){};

try{
    loginForm.addEventListener('submit',async (e)=>{
        e.preventDefault();
        var loginObj={
            email:email.value,
            password:password.value
        };
        try{
            const result=await axios.post("http://localhost:3000/user/login",loginObj)
            // console.log(result);
            if(result.data.success==="false"){
                showMessage('password wrong','red');
            }else if(result.data.success==="true"){
                showMessage(result.data.message,'green');
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


