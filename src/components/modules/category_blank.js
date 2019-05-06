import React from 'react';

class Category extends React.Component {
    render(){
        return(
            <a href={"gallery/"+this.props.name}>
                <div className="category_item" style={{backgroundImage: "url(" + require("../../assets/img/no_img.jpg") + ")"}}>
                    <div className="desc_cat">
                        <h3 className="desc">{this.props.name}</h3>
                        <span>Počet obrázkov: 0</span>
                    </div>
                </div>
            </a>
        );
    }
}
export default Category;
