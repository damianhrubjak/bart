import React from 'react';
import { Config } from "../../config.js";

class Category extends React.Component {
    state = {
        count: 0,
    }
    componentWillMount() {
        fetch(Config.apiUrl + "/gallery/" + this.props.name)
            .then(response => response.json())
            .then(response => {
                this.setState({
                    count: response.images.length
                })
            });
    }

    render() {
        const image = Config.apiUrl + "/images/300x220/" + this.props.image;
        return (
            <a href={"gallery/" + this.props.name}>
                <div className="category_item" style={{ backgroundImage: `url(${image})` }}>
                    <div className="desc_cat">
                        <h3 className="desc">{this.props.name}</h3>
                        <span>Počet obrázkov: {this.state.count}</span>
                    </div>
                </div>
            </a>
        );
    }
}
export default Category;
