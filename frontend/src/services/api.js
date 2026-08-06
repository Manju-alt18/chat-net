// api.js
const API = "http://localhost:8080";

export async function login(username,password){

    const response = await fetch(
        API+"/login",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                username,
                password
            })
        });

    return response.json();

}

export async function register(user){

    const response = await fetch(
        API+"/register",
        {
            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify(user)
        });

    return response.json();

}

export async function getHistory(sender,receiver){

    const response=await fetch(

        API+
        "/history?sender="+
        sender+
        "&receiver="+
        receiver

    );

    return response.json();

}

export async function createGroup(groupName,createdBy){

    const response=await fetch(

        API+"/group",

        {

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({

                groupName,
                createdBy

            })

        });

    return response.json();

}