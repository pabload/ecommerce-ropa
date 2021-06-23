import React, { useEffect, useState } from 'react';
import { auth } from '../firebase/firebase-config'
import firebaseService from '../firebase/firebase-service';

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setcurrentUser] = useState(null);
    const [userInfo, setUserInfo] = useState({});
    const [userInfoId, setUserInfoId] = useState(null);
    useEffect(() => {
       
        if(sessionStorage.getItem("userInfoId")){
            console.log('Recargo o entro userid: '+sessionStorage.getItem("userInfoId"));
            setUserInfoId(sessionStorage.getItem("userInfoId"));
        }
        if(sessionStorage.getItem("currentUser")){
            setcurrentUser(sessionStorage.getItem("currentUser"));
        }
        
        auth.onAuthStateChanged(setcurrentUser);
        return ()=>{
         
        }
    }, []);
    useEffect(() => {
        if(currentUser&&userInfoId!=null){
            sessionStorage.setItem("userInfoId",userInfoId);
            sessionStorage.setItem("currentUser",currentUser);
            firebaseService.dbUser.doc(userInfoId).onSnapshot((doc)=>{
                let info = doc.data();
                if(info !== undefined){
                    info.id=userInfoId;
                    setUserInfo(info);
                }
            })
        }
        return ()=>{
            
        }
    }, [userInfoId]);
    return (
        <AuthContext.Provider value={{ currentUser, userInfo,userInfoId,setUserInfo, setUserInfoId }}>
            {children}
        </AuthContext.Provider>
    );
}