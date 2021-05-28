import React, {useContext, useEffect, useState} from "react";
import {Avatar, ButtonProps, Grid, IconButton, TextField} from "@material-ui/core";
import {
    Palette,
    SearchOutlined,
    ExitToApp,
} from "@material-ui/icons";
import {SvgIcon} from '@material-ui/core';

import db, {auth, provider} from "../../firebase";
import {useHistory} from "react-router";
import "./Sidebar.css";
import {StateContext} from "../../providers/StateProvider";
import SidebarChat from "../SidebarChat/SidebarChat";
import {DarkModeContext} from "../../providers/ThemeDarkProvider";
import {actionTypes} from "../../reducer";
const util = require('util');


interface SideBarInterface {

}

const SideBar = (props: SideBarInterface) => {
    const [rooms, setRooms] = useState<any>([]);
    const [employee, setEmployee] = useState<any>({data: null});
    const [{user}, dispatch] = useContext(StateContext);
    const history = useHistory();

    const logout = () => {
        auth.signOut()
            .then((result) => {
                dispatch({
                    type: actionTypes.LOGOUT,
                    user: null
                });
                history.push('/');
            })
            .catch((error) => alert(error.message));
    };

    const isEmployee = ():boolean => {
        return employee.hasOwnProperty('uid');
    }

    useEffect(() => {

        //iife
        (async () => {
            let subscribeEmployee = false;
            try {
                //verificar se é employee
                if(!user.uid) {
                    return;
                }

                const result = await new Promise((resolve => {
                    db.collection("employees")
                    .doc(user.uid)
                    .onSnapshot((snapshot) => {
                        const result = snapshot
                            ? snapshot.data()
                            : {data: null};
                        if (result?.hasOwnProperty('uid')) {
                            console.log('is empployee');
                            setEmployee(result);
                            return resolve(true);
                        }
                        return resolve(false);
                    })
                }))

                console.log(`%c employee %c flag: `, 'background: orange; color: black;border-radius: 12px 0 0 12px','background: #fbe4a0; color: back;border-radius: 0 12px 12px 0',result);

                if (result) {
                    return db.collection("rooms")
                        .where('members', 'array-contains', user.uid)
                        .orderBy('last_timestamp','desc')
                        .onSnapshot((snapshot) => {
                            const result = snapshot
                                ? snapshot.docs.map((doc) => ({
                                        id: doc.id,
                                        data: doc.data()
                                    })
                                ) : [];
                            if (result.length) {
                                setRooms(result)
                            }
                        });
                }

                const isClientRoom = await new Promise((resolve => {
                    db.collection("rooms")
                        .doc(user.uid)
                        .onSnapshot((snapshot) => {
                            const client = snapshot ? {id: user.uid, data: snapshot.data()} : false;

                            if (client?.hasOwnProperty('id')) {
                                console.log('is client #01', client)
                                setRooms([client]);
                                return resolve(true)
                            }
                                resolve(false)
                            });
                        }
                    ))

                if (isClientRoom) {
                    console.log(`%c existe rooms on %c client `, 'background: orange; color: black;border-radius: 12px 0 0 12px','background: #fbe4a0; color: back;border-radius: 0 12px 12px 0', isClientRoom);
                    return true;
                }

                console.log(isClientRoom);
                console.log('new rooms', user.uid)

                //default employees
                const attachEmployees = await db.collection("master_employees").get();
                const employeesId = attachEmployees.docs.map((doc) => {
                   return doc.id
                })

              return await db.collection("rooms").doc(user.uid).set({
                        members: employeesId,
                        owner: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        }
                    });


            } catch (error) {
                console.error(error);
            }
        })();
    }, []);

    return (
        <React.Fragment>
            <div className="sidebar">
                <div className="sideBheader">
                    <Avatar src={user?.photoURL}/>
                    <div className="sideBHeaderInfo">
                        <div className="header">
                            <span>{user?.displayName}</span>
                        </div>
                        <div className="header">
                            <span>{user?.email}</span>
                        </div>


                    </div>

                    <div className="sideBheaderRight">
                        <IconButton>
                        <SvgIcon fontSize={"large"} width={"6rem"} height={"6rem"} color={"primary"}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 141.8 20.6" fill={"red"}>
                                <path fill="#FFFFFF"
                                      d="M21.8,0.1h1.5v20.5h-1.5V0.1z M5.7,11.3h7.4V9.9H5.7V11.3z M0,0.1v20.5h1.5v-9.3h0V9.9h0V1.5h15.8V0.1H0z M69.1,0.1H57v20.5h1.5v-7.6h0v-1.4h0v-10H69c3.7,0,6.2,1.7,6.2,4.9v0.1c0,3-2.6,5-6.4,5H64v1.4h4.7c4.3,0,8-2.2,8-6.5V6.3 C76.7,2.4,73.6,0.1,69.1,0.1 M46.4,11.5l-6.1-9.9l-11.8,19h-1.6L39.6,0H41l7.1,11.5H46.4z M53.8,20.6h-1.7l-3.3-5.3h1.7L53.8,20.6z M112.6,18H86.3V2.2h26.2c-3.6,1-6,4.1-6,7.9v0C106.4,13.9,108.9,17.1,112.6,18 M114.9,15c-2.8,0-4.8-2.3-4.8-5v0 c0-2.7,1.9-4.9,4.8-4.9s4.8,2.3,4.8,5v0C119.6,12.8,117.7,15,114.9,15 M117.3,2.2h8V18H117c3.7-0.9,6.2-4.1,6.2-7.9v0 C123.3,6.3,120.9,3.2,117.3,2.2 M136.1,11.9l-7.4-9.7h7.4V11.9z M128.8,7.9l7.7,10.1h-7.7V7.9z M141.8,18h-2.3V2.2h2.3V18z"></path>
                            </svg>
                        </SvgIcon>
                        </IconButton>
                        <IconButton>
                            <Palette/>
                        </IconButton>
                        <IconButton onClick={logout}>
                            <ExitToApp/>
                        </IconButton>
                    </div>
                </div>

                <div className="sidebar__search">
                    {/*<div className="sidebar__searchContainer">
                        <SearchOutlined/>
                        <input placeholder="busque..." type="text"/>
                    </div>*/}
                        <Grid container spacing={1} alignItems="flex-end">
                            <Grid item>
                                <SearchOutlined color="inherit"/>
                            </Grid>
                            <Grid item>
                                <TextField
                                    fullWidth={true}
                                    inputMode={"text"}
                                    id="input-with-icon-grid"
                                    placeholder="buscar contato" />
                            </Grid>
                        </Grid>

                </div>

                <div className="sidebar__chats">
                    {rooms.map((room) => (
                        <SidebarChat
                            key={room.id}
                            id={room.id}
                            room={room.data}
                            isEmployee={isEmployee()}
                        />
                    ))}
                </div>
            </div>
        </React.Fragment>
    );
}



export default SideBar;
