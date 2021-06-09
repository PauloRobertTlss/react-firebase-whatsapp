/* eslint-disable no-undef */
import React, {useContext, useEffect, useState} from "react";
import {Avatar, Badge, Box, Fab, Toolbar, Typography} from "@material-ui/core";
import {Link} from "react-router-dom";
import db from "../../firebase";
import "./SidebarChat.css";
import {StateContext} from "../../providers/StateProvider";
import {MessageOutlined} from "@material-ui/icons";
import { formatDistance } from 'date-fns'

interface SidebarChatInterface {
    room?: any,
    id?: string,
    addNewChat?: any,
    isEmployee?: boolean
}

const SidebarChat = (props: SidebarChatInterface) => {
    const {room, id, isEmployee} = props;
    const [{user}, dispatch] = useContext(StateContext);
    const [readers, setReaders] = useState<number>(0);
    const [members, setMembers] = useState<any>([]);

    useEffect(() => {

        //iife
        (async () => {
            if (room) {
                console.log(`${id}-${user.uid}`)
                await db.collectionGroup('readers')
                    .where('uid','==', `${id}-${user.uid}`)
                    .get().then((equery) => {
                        const docs = equery.docs.length;
                        setReaders(docs)
                    });

                await db.collection('employees')
                    .where('uid', 'in', room.members).get();
                setMembers(members.docs.map((doc) => doc.data()));
            }
        })()
    }, [room]);

    return (
        <React.Fragment>
            <Link to={`/rooms/${id}`}>
                {isEmployee ?
                    (<div className="sidebarChat">
                        <Avatar
                            src={room?.owner?.photoURL || `https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200`}/>
                        <Box flexGrow={1}>
                            <div className="sidebarChat__info">
                                <span>{room?.owner?.displayName}</span>
                                <p>{room?.members?.length}</p>
                            </div>
                        </Box>
                        <Box>
                            <Toolbar>
                                <Typography color="primary" style={{flexGrow: 1, float: 'right', width: '99%'}}>
                                    <small>{
                                        room.last_timestamp
                                            ? formatDistance(new Date(room.last_timestamp),new Date(),{addSuffix: true })
                                            : '-'
                                    }</small>
                                    <Badge badgeContent={readers} color="primary" style={{marginLeft:'3px'}}>
                                        <MessageOutlined/>
                                    </Badge>
                                </Typography>
                            </Toolbar>
                        </Box>


                    </div>)
                    :
                    (<div className="sidebarChat">
                        <Avatar
                            src={members[0]?.photoURL || `https://www.gravatar.com/avatar/205e460b479e2e5b48aec07710c08d50?s=200`}/>
                        <div className="sidebarChat__info">
                            <span>{members[0]?.displayName}</span>
                            <p>{members?.length} - {isEmployee}</p>
                        </div>
                        <div className="sidebarChat__hour">
                            <small>{members[0]?.displayName}</small>
                        </div>
                    </div>)
                }
            </Link>
        </React.Fragment>
    )
}

export default SidebarChat;
