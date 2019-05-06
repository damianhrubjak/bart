import React from 'react';

class Home extends React.Component {
    render() {
        return (
            <div>
                <div className="content_error">
                    <h1><span>Chybový kód: 404</span> <br />Stránka neexistuje</h1>
                    <a href='/'>Naspäť na domovskú stránku</a>
                </div>
            </div>
        );
    }
}
export default Home;
