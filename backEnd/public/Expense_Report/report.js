var current_date=document.getElementById('current_date');
        var year=document.getElementById('year');
        var month_year=document.getElementById('month_year');
        var monthly_table=document.getElementById('monthly_table')
        var yearly_talbe=document.getElementById('yearly_table');
        //adding table
        current_date.innerText=new Date().toLocaleString();
        
        function createMonthlyTable(objArr){
            var table=document.createElement("table");
            table.setAttribute('class','monthly_table');
            var caption=document.createElement('caption');
            caption.textContent="February 2020"; //this should be dynamic,will change later
            var tr=document.createElement('tr');
            var th1=document.createElement('th');
            th1.textContent="Date";
            
            var th2=document.createElement('th');
            th2.textContent="Description";
            
            var th3=document.createElement('th');
            th3.textContent="Category";
            
            var th4=document.createElement('th');
            th4.textContent="Income";
            
            var th5=document.createElement('th');
            th5.textContent="Expense"
            tr.append(th1,th2,th3,th4,th5);
            table.append(caption,tr);
            //adding all the rows
            objArr.forEach((obj)=>{
                let tr=createMonthlyRow(obj);
                table.appendChild(tr);
            })
            //adding last total calculation row
            monthly_table.appendChild(table);
        }
        
        
        function createMonthlyRow(obj){
            var tr=document.createElement('tr');
            var td1=document.createElement('td');
            td1.textContent=obj.date;
            
            var td2=document.createElement('td');
            td2.textContent=obj.description;
            
            var td3=document.createElement('td');
            td3.textContent=obj.category;
            
            var td4=document.createElement('td');
            td4.textContent=obj.income;
            
            var td5=document.createElement('td');
            td5.textContent=obj.expense
            
            tr.append(td1,td2,td3,td4,td5);
            return tr;
        }
        
        function createYearlyTable(objArr){
            var table=document.createElement("table");
            table.setAttribute('class','yearly_table');
            var caption=document.createElement('caption');
            caption.textContent="Yearly Report";
            var tr=document.createElement('tr');
            var th1=document.createElement('th');
            th1.textContent="Month";
            
            var th2=document.createElement('th');
            th2.textContent="Income";
            
            var th3=document.createElement('th');
            th3.textContent="Expense";
            
            var th4=document.createElement('th');
            th4.textContent="Savings";
            
            tr.append(th1,th2,th3,th4);
            table.append(caption,tr);
            //adding all the rows
            objArr.forEach((obj)=>{
                let tr=createYearlyRow(obj);
                table.appendChild(tr);
            })
            //adding last total calculation row
            yearly_talbe.appendChild(table);
        }
        
        function createYearlyRow(obj){
            var tr=document.createElement('tr');
            var td1=document.createElement('td');
            td1.textContent=obj.month;
            
            var td2=document.createElement('td');
            td2.textContent=obj.income;
            
            var td3=document.createElement('td');
            td3.textContent=obj.expense
            
            var td4=document.createElement('td');
            td4.textContent=obj.saving;
            
            tr.append(td1,td2,td3,td4);
            return tr;
        }

        createYearlyTable([{month:'June',income:'10000',expense:'5000',saving:'5000'}]);

        createMonthlyTable([{date:'2020/20/2',description:'Apple',category:'food',income:'10000',expense:'5000'},{date:'2020/20/2',description:'Apple',category:'food',income:'10000',expense:'5000'}]);