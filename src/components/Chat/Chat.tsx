import React, {useContext, useEffect, useRef, useState} from "react";
import {Avatar, IconButton} from "@material-ui/core";
import {
    AttachFile,
    InsertEmoticon,
    Mic,
    MoreVert,
    SearchOutlined,
    Send,
} from "@material-ui/icons";
import {useParams} from "react-router-dom";
import firebase from "firebase";
import Picker, {SKIN_TONE_MEDIUM_DARK} from "emoji-picker-react";

import db from "../../firebase";
import "./Chat.css";
import {StateContext} from "../../providers/StateProvider";
import crypto from 'crypto';

interface ChatInterface {

}

interface RoomInterface {
    owner?: {
        email?: string,
        displayName?: string,
        photoURL?: string
    },
    members: Array<string>

}

interface DOMEvent<T extends EventTarget> extends Event {
    readonly target: T
}

interface ChatInput extends HTMLDivElement {
    selectionStart?: any
}

let recognition: any;

const Chat = (props: ChatInterface) => {
    const [input, setInput] = useState("");
    const [seed, setSeed] = useState<number>(0);
    const {roomId} = useParams<any>();
    const [room, setRoom] = useState<RoomInterface>({} as RoomInterface);
    const [messages, setMessages] = useState<any>([]);
    const [{user}, dispatch] = useContext(StateContext);

    const emojiPickerRef = useRef() as React.MutableRefObject<HTMLDivElement>;
    const messagesRef = useRef() as React.MutableRefObject<HTMLDivElement>;

    // setup the room name and populate messages when Chat component is loaded.
    useEffect(() => {
        if (roomId) {
            db.collection("rooms")
                .doc(roomId)
                .onSnapshot((snapshot) => {
                    const result = snapshot ? snapshot.data() as RoomInterface : {owner: {}} as RoomInterface;
                    setRoom(result);
                });

            db.collection("rooms")
                .doc(roomId)
                .collection("messages")
                .orderBy("timestamp", "asc")
                .onSnapshot((snapshot) => {
                        setMessages(snapshot.docs.map((doc) => {
                            return {...doc.data(), id: doc.id}
                        }));
                    }
                );
        }
    }, [roomId]);

    // generate random avatars for chat
    useEffect(() => {
        setSeed(Math.floor(Math.random() * 5000));
    }, [roomId]);

    // add event listeners when component is loaded
    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);

        if (messagesRef) {
            messagesRef?.current.addEventListener("DOMNodeInserted", (event: any) => {
                const {currentTarget: target} = event;
                target.scroll({top: target.scrollHeight, behavior: "smooth"});
            });
        }

        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    const handleClickOutside = (event) => {
        if (
            emojiPickerRef.current &&
            !emojiPickerRef?.current?.contains(event.target)
        ) {
            hideEmojiPicker();
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();

        if (input.length === 0 || input.trim().length === 0) return;

        db.collection("rooms").doc(roomId).update({'last_timestamp': new Date().toISOString()})
        db.collection("rooms").doc(roomId).collection("messages").add({
            name: user.displayName,
            message: input,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(async (data) => {
            // const members = room.members;
            console.log(data.id);
            const batch = db.batch();
            await room.members.map(async (item)=> {
                const collectionRef = await db.collection("rooms")
                    .doc(roomId)
                    .collection("messages")
                    .doc(data.id)
                    .collection('readers')
                    .doc(item);

                batch.set(collectionRef, {read: false, uid: `${roomId}-${item}`});
            });

            await batch.commit();
        }).catch((err) => {
            console.log(err)
        });

        setInput("");
    };

    const startSpeechRecognition = (e) => {

        if (window.hasOwnProperty("webkitSpeechRecognition")) {
            // eslint-disable-next-line no-undef
            // @ts-ignore
            recognition = new webkitSpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.lang = "pt-BR";
            recognition.start();
            recognition.onresult = function (e) {

                let cursorPosition = (document.getElementById("chatInput") as ChatInput).selectionStart;
                setInput(
                    `${input.slice(0, cursorPosition)}${
                        e?.results[0][0]?.transcript
                    }${input.slice(cursorPosition)}`
                );
                recognition.stop();
            };

            recognition.onerror = function (e) {
                recognition.stop();
            };
        }
    };

    const showEmojiPicker = () =>
        ((document.getElementById("emojiPickerContainer") as HTMLDivElement).style.display = "block");

    const hideEmojiPicker = () =>
        ((document?.getElementById("emojiPickerContainer") as HTMLDivElement).style.display = "none");

    const onEmojiClick = (e, emojiObject) => {
        let cursorPosition: any;
        // @ts-ignore
        cursorPosition = document.getElementById("chatInput").selectionStart;
        setInput(
            `${input.slice(0, cursorPosition)}${emojiObject.emoji}${input.slice(
                cursorPosition
            )}`
        );

        hideEmojiPicker();
    };

    return (
        <React.Fragment>
            {user ?
            <div className="chat">
                <div className="chatHeader">
                    <Avatar src={room?.owner?.photoURL}/>
                    <div className="chatHeaderInfo">
                        <h3>{room?.owner?.displayName}</h3>
                        {messages.length > 0 && (
                            <p>
                                online há {" "}
                                {new Date(
                                    messages[messages.length - 1]?.timestamp?.toDate()
                                ).toLocaleString()}
                            </p>
                        )}
                    </div>
                    <div className="chatHeaderRight">
                        <IconButton>
                            <SearchOutlined/>
                        </IconButton>
                        <IconButton>
                            <AttachFile/>
                        </IconButton>
                        <IconButton>
                            <MoreVert/>
                        </IconButton>
                    </div>
                </div>

                <div className="chat__body" ref={messagesRef}>
                    {messages.map((message) => (
                        <p
                            id={message.id}
                            key={`${message.id}-message`}
                            className={`chat__message ${
                                message.name === user?.displayName && "chat__receiver"
                            }`}
                        >
                            <span className="chat__name">{message.name}</span>
                            <span className="chat__messageText">{message.message}</span>
                            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toLocaleTimeString()}
            </span>
                        </p>
                    ))}
                </div>

                <div className="chat__footer">
                    <div
                        ref={emojiPickerRef}
                        className="chat__emojiPicker"
                        id="emojiPickerContainer"
                        style={{display: "none"}}
                    >
                        <Picker
                            onEmojiClick={onEmojiClick}
                            disableAutoFocus={true}
                            skinTone={SKIN_TONE_MEDIUM_DARK}
                            groupNames={{smileys_people: "PEOPLE"}}
                            native
                        />
                    </div>
                    <IconButton onClick={showEmojiPicker}>
                        <InsertEmoticon/>
                    </IconButton>
                    <form>
                        <input
                            type="text"
                            value={input}
                            id="chatInput"
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type a message"
                        />
                        <button onClick={sendMessage} type="submit">
                            <Send/>
                        </button>
                    </form>
                    <IconButton onClick={startSpeechRecognition}>
                        <Mic/>
                    </IconButton>
                </div>
            </div>
            : null}
        </React.Fragment>
    );
}

export default Chat;
