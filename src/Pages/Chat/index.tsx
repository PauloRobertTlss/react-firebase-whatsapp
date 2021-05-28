import * as React from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";
import Chat from "../../components/Chat/Chat";

interface ChatInterface {

}

const Index = (props: ChatInterface) => {

    return (
        <React.Fragment>
            <Sidebar/>
            <Chat/>
        </React.Fragment>
    )
}

export default Index;

