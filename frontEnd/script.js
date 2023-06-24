var uname=document.getElementById('name');
var email=document.getElementById('email');
var password=document.getElementById('password');
var frm=document.getElementById('frm');
console.log(document);

frm.addEventListener('submit',async (e)=>{
    e.preventDefault();
    var signupObj={
        name:uname.value,
        email:email.value,
        password:password.value
    };
    try{
        const result=await axios.post("http://localhost:3000/user/signup",signupObj)
        console.log(result);
    }catch(err){
        console.log(err);
    }
})

