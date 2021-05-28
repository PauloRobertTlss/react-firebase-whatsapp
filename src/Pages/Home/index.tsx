import * as React from 'react';
import Sidebar from "../../components/Sidebar/Sidebar";

interface HomeInterface {

}

const Index = (props: HomeInterface) => {

    return (
        <React.Fragment>
            <Sidebar/>
        </React.Fragment>
    )
}

export default Index;

