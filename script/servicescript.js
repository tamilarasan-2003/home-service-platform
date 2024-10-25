let ip="http://127.0.0.1:3000";
function main(){
    fetch(`${ip}/servicedata`).then((res)=>{
        return res.json();
    })
    .then((data)=>{
        data.forEach((chunk) => {
            console.log(`${chunk}`)
                addrow(chunk.name,chunk.contact,chunk.email,chunk.service,chunk.address,chunk.status)
        });
    })
}   

function addrow(name,contact,email,service,address,status){
    let tbody=document.querySelector("#tbody");
    let tr=document.createElement("tr");
    let td1=document.createElement("td")
    td1.innerText=name;
    tr.append(td1);
    let td2=document.createElement("td")
    td2.innerText=contact;
    tr.append(td2);
    let td3=document.createElement("td")
    td3.innerText=email;
    tr.append(td3);
    let td4=document.createElement("td")
    td4.innerText=service;
    tr.append(td4);
    let td5=document.createElement("td")
    td5.innerText=address;
    tr.append(td5);
    
    let td6 = document.createElement("td");
    let statusSelect = document.createElement("select");
    ["Pending", "In Progress", "Completed"].forEach((statusOption) => {
        let option = document.createElement("option");
        option.value = statusOption;
        option.innerText = statusOption;
        if (statusOption === status) {
            option.selected = true;
        }
        statusSelect.append(option);
    });
    td6.append(statusSelect);
    tr.append(td6);

    let td7 = document.createElement("td");
    let saveButton = document.createElement("button");
    saveButton.innerText = "Save";
    saveButton.onclick = () => {
        const newStatus = statusSelect.value;
        let temp=tr.children;
        let newstatus=tr.children[5].children[0].value
        console.log(temp)
        fetch(`${ip}/statuschange?name=${temp[0].innerText}&contact=${temp[1].innerText}&service=${temp[3].innerText}&status=${newstatus}`)
        .then(data => data.json())
        .then((data)=>{
            if(data.modified){
                console.log("Modified Successfull")
                alert("Modified Successfull")
            }
        })
        console.log(`Modified status for ${name}: ${newStatus}`);
    };
    td7.append(saveButton);

    let deleteButton = document.createElement("button");
    deleteButton.innerText = "Delete";
    deleteButton.onclick = () => {
        let temp=tr.children;
        fetch(`${ip}/delete?name=${temp[0].innerText}&contact=${temp[1].innerText}&service=${temp[3].innerText}`)
        .then(data => data.json())
        .then((data)=>{
            if(data.deleted){
                console.log("Deleted Successfull")
                alert("Deleted Successfull")
            }
        })
        tbody.removeChild(tr); 
    };
    td7.append(deleteButton);
    tr.append(td7);
    tbody.append(tr);
}

