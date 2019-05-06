import React from 'react';
import { Config } from "../../config.js";



class ImageItem extends React.Component {
    click(e, img) {
        this.props.openLightbox(img);
        e.preventDefault();
    }
    render() {
        return (
            <div className="gallery_item">
                <a href={Config.apiUrl + "/images/300x220/" + this.props.img_path} className='gallery_img' onClick={(e) => this.click(e, this.props.indexOpen)} >
                    <div style={{ backgroundImage: `url(${Config.apiUrl + "/images/300x220/" + this.props.img_path})` }}></div>
                </a>
            </div>

        );
    }
}
export default ImageItem;
