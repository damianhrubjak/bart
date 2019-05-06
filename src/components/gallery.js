import React from "react";
import ImageItem from "./modules/image_item.js";
import Nav from "./modules/navigation.js";
import { Config } from "../config.js";
import Author from "./modules/author.js";

import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';


const page_name = window.location.pathname.split("/").pop();

class Gallery extends React.Component {
	state = {
		on: false,
		onDelete: false,
		onDeleteImage: false,
	};
	constructor(props) {
		super(props);
		this.state = {
			images: [],
			files: [],
			count: 0,
			uploadedImages: 0,
			indexOpen: null,
		};
		this.FileInput = null;
	}
	componentDidMount() {
		document.addEventListener("keyup", e => {
			if (e.keyCode === 27) {
				this.setState({
					on: false,
					onDelete: false,
					onDeleteImage: false,
				});
			}
		});
		this.fetch_data();
	}

	fetch_data() {
		fetch(
			Config.apiUrl +
			"/gallery/" +
			this.props.location.pathname.split("/").pop()
		)
			.then(response => {
				if (response.status === 404) {
					window.location = "/errorPage";
				} else {
					return response.json();
				}
			})
			.then(parsedJSON =>
				parsedJSON.images.map(images => ({
					img_path: `${images.fullpath}`,
					image_name: `${images.name}`
				}))
			)
			.then(images =>
				this.setState({
					images
				})
			);
	}

	onChangeHandler = e => {
		this.setState({
			files: { ...e.target.files },
			count: e.target.files.length
		});
	};
	upload(file) {
		let data = new FormData();
		data.append("file", file);
		fetch(Config.apiUrl + "/gallery/" + page_name, {
			method: "post",
			dataType: "json",
			body: data
		})
			.then(response => response.json())
			.then(json => {
				this.setState(prevState => ({
					uploadedImages: prevState.uploadedImages + 1
				}));
				if (this.FileInput.files.length === this.state.uploadedImages) {

					this.setState({
						on: false,
						FileInput: null,
						count: 0,
						uploadedImages: 0
					});
					this.fetch_data();
				}
			});
	}
	onClickHandler = () => {
		for (let i = 0; i < this.FileInput.files.length; i++) {
			this.upload(this.FileInput.files[i]);
		}
	};
	deleteGallery = () => {
		fetch("http://api.programator.sk/gallery/" + page_name, {
			method: 'delete'
		})
			.then(response => {
				if (response.status === 200) {
					this.fetch_data();
				}
			})
	}
	deleteGalleryImage(image_name) {
		fetch("http://api.programator.sk/gallery/" + image_name, {
			method: 'delete'
		})
			.then(response => {
				if (response.status === 200) {
					this.fetch_data();
				}
			})
	}

	renderLightbox(index) {
		this.setState({
			indexOpen: index
		})
	}
	render() {
		var page_name = this.props.location.pathname;

		let i = -1;
		const images = this.state.images.map(image => {
			i++;
			const { img_path, image_name } = image;
			return <ImageItem openLightbox={(i) => this.renderLightbox(i)} indexOpen={i} img_path={img_path} key={image_name} />;
		})
		return (
			<div>
				<Nav />
				<div className="content">
					<h1>Fotogaléria</h1>
					<a href="/" className="back_link">
						<img src={require("../assets/img/back_icon.svg")} alt="obrazok" />{" "}
						{page_name.split("/").pop()}
					</a>
					<hr />
					<div className="gallery">
						{
							this.state.indexOpen !== null && (
								<Lightbox
									mainSrc={Config.apiUrl + "/images/0x0/" + this.state.images[this.state.indexOpen].img_path}

									nextSrc={Config.apiUrl + "/images/0x0/" + this.state.images[(this.state.indexOpen + 1) % this.state.images.length].img_path}

									prevSrc={Config.apiUrl + "/images/0x0/" + this.state.images[(this.state.indexOpen + this.state.images.length - 1) % this.state.images.length].img_path}

									onMovePrevRequest={() =>
										this.setState(prevState => ({
											indexOpen: (prevState.indexOpen + prevState.images.length - 1) % prevState.images.length,
										}))

									}
									onMoveNextRequest={() =>
										this.setState(prevState => ({
											indexOpen: (prevState.indexOpen + 1) % prevState.images.length,
										}))
									}
									onCloseRequest={() => this.setState({ indexOpen: null })}
								/>
							)}
						{images}
						<div
							className="gallery_item_add"
							onClick={() => {
								this.setState({ on: !this.state.on });
								window.scroll({ top: 0, behavior: "smooth" });
							}}
						>
							<img src={require("../assets/img/add_image.svg")} alt="" />
							<p>Pridať fotky</p>
						</div>
					</div>
					{
						this.state.images.length ?
							(
								<div className="delete_box">
									<div className="delete_item" ><button
										onClick={() => {
											this.setState({ onDelete: !this.state.onDelete });
											window.scroll({ top: 0, behavior: "smooth" });
										}}
									>Zmazať Galériu</button></div>

									<div className="delete_item" ><button
										onClick={() => {
											this.setState({ onDeleteImage: !this.state.onDeleteImage });
											window.scroll({ top: 0, behavior: "smooth" });
										}}
									>Zmazať Obrázok</button></div>
								</div>
							) :
							(<div className="delete_box">
								<div className="delete_item" >
									<button
										onClick={() => {
											this.setState({ onDelete: !this.state.onDelete });
											window.scroll({ top: 0, behavior: "smooth" });
										}}
									>Zmazať Galériu</button>
								</div>
							</div>)
					}
					<Author />
				</div>
				<div className={this.state.on ? "modal modal_show" : "modal"}>
					<div className="sub_modal">
						<div className="flex-right">
							<button
								type="button"
								id="close_modal"
								onClick={() => {
									this.setState({ on: !this.state.on });
								}}
							>
								<img src={require("../assets/img/close_icon.svg")} alt="obrazok" />
								Zavrieť</button>
						</div>
						<div className="modal_content">
							<h2>Pridať fotky</h2>
							<form
								id="upload_form"
								encType="multipart/form-data"
								method="post"
							>
								<input
									ref={ref => (this.FileInput = ref)}
									type="file"
									name="images[]"
									multiple
									id="add_image_input"
									onChange={this.onChangeHandler}
								/>
								<label htmlFor="add_image_input">
									<div className="drag_n_drop">
										<img
											src={require("../assets/img/add_image.svg")}
											alt="obrazok"
										/>
										<p className="img_add_file_desc" id="img_name">Sem presuňte fotky</p>
										<p>alebo</p>
										<p id="select_manual">
											{this.state.count
												? "Počet vybratých súborov: " + this.state.count
												: "Vyberte súbory"}
										</p>
									</div>
								</label>
								<div className="flex-right">
									<button
										type="button"
										name="add_button"
										onClick={this.onClickHandler}
									>
										<img src={require("../assets/img/add_icon.svg")} alt="obrazok" />
										Pridať </button>
								</div>
							</form>
						</div>
					</div>
				</div>
				{/* delete gallery */}
				<div className={this.state.onDelete ? "modal modal_show" : "modal"}>
					<div className="sub_modal">
						<div className="flex-right">
							<button
								type="button"
								id="close_modal"
								onClick={() => {
									this.setState({ onDelete: !this.state.onDelete });
								}}
							>
								<img src={require("../assets/img/close_icon.svg")} alt="obrazok" />
								Zavrieť
             				 </button>
						</div>
						<div className="delete_modal">
							<h2>Chcete naozaj vymazať celú galériu ?</h2>
							<p>Táto operácia je nezvratná</p>

							<button
								type="button"
								name="add_button"
								onClick={this.deleteGallery}
							>
								<img
									src={require("../assets/img/close_icon.svg")}
									alt="obrazok"
								/>{" "}
								Vymazať
							</button>
						</div>
					</div>
				</div>
				{/* Delete Images */}
				<div className={this.state.onDeleteImage ? "modal modal_show" : "modal"}>
					<div className="sub_modal">
						<div className="flex-right">
							<button
								type="button"
								id="close_modal"
								onClick={() => {
									this.setState({ onDeleteImage: !this.state.onDeleteImage });
								}}
							>
								<img src={require("../assets/img/close_icon.svg")} alt="obrazok" />
								Zavrieť
             				 </button>
						</div>

						<div className="delete_modal">
							<h2>Vyberte si obrázok, ktorý sa má vymazať</h2>
							<p>Po kliknutí na obrázok, sa automaticky vymaže</p>
							<div className="delete_image_box">
								{
									this.state.images.map(image => {
										const { img_path, image_name } = image;
										var img_path2 = Config.apiUrl + "/images/300x220/" + img_path;
										return <button type="submit" className="delete_image" key={image_name}
											onClick={() => this.deleteGalleryImage(img_path)} ><img src={img_path2} alt={image_name} /></button>;
									})
								}
							</div>
						</div>
					</div>
				</div>
			</div >
		);
	}
}
export default Gallery;
