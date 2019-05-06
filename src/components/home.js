import React from "react";
import Nav from "./modules/navigation.js";
import Author from "./modules/author.js";
import Category from "./modules/category_fetch.js";
import CategoryB from "./modules/category_blank.js";
import { Config } from "../config.js";

class Home extends React.Component {
  state = {
    on: false,
    exist: false
  };
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      catName: ""
    };
  }
  componentDidMount() {
    document.addEventListener("keyup", e => {
      if (e.keyCode === 27) {
        this.setState({
          on: false
        });
      }
    });
    this.fetch_data();
  }
  fetch_data() {
    fetch(Config.apiUrl + "/gallery")
      .then(response => response.json())
      .then(json => {
        const cat = json.galleries.filter(galleries => {
          if (galleries.image) {
            return {
              cat_name: `${galleries.name}`,
              img_full_path: `${galleries.image.fullpath}`
            };
          } else {
            return {
              cat_name: `${galleries.name}`
            };
          }
        });
        return cat;
      })
      .then(categories => {
        this.setState({
          categories
        });
      });
  }
  onSubmit = event => {
    event.preventDefault();
    fetch(Config.apiUrl + "/gallery", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: this.state.catName
      })
    })
      .then(response => {
        if (response.status === 409) {
          this.setState({
            exist: true
          });
          console.clear();
          return false;

        } else {
          return response.json();
        }
      })
      .then(response => {
        if (response.name === this.state.catName) {
          this.fetch_data();
          this.setState({
            on: false
          });
        }
      });
  };
  render() {
    return (
      <div>
        <Nav />
        <div className="content">
          <h1>Fotogaléria</h1>
          <p className="back_link">Kategórie</p>
          <hr />
          <div className="categories">
            {this.state.categories.map(category => {
              if (category.image !== undefined) {
                const image = category.image.fullpath;
                const { name } = category;
                return <Category key={name} name={name} image={image} />;
              } else {
                const { name } = category;
                return <CategoryB key={name} name={name} />;
              }
            })}
            <div
              className="categoty_item_add"
              id="add_image_div"
              onClick={() => {
                this.setState({ on: !this.state.on });
                window.scroll({ top: 0, behavior: "smooth" });
              }}
            >
              <img src={require("../assets/img/add_cat.svg")} alt="" />
              <p>Pridať kategóriu</p>
            </div>
          </div>
          <Author />
        </div>
        <div className={this.state.on ? "modal modal_show" : "modal"}>
          <div className="sub_modal">
            <div className="flex-right">
              <button
                type="button"
                id="close_modal"
                onClick={() => this.setState({ on: !this.state.on })}
              >
                <img
                  src={require("../assets/img/close_icon.svg")}
                  alt="obrazok"
                />
                Zavrieť
              </button>
            </div>
            <div className="modal_content">
              <h2>
                {
                  this.state.exist ? <span className='error_msg'>Chyba: Galéria existuje</span> : ("Pridať kategóriu")
                }
              </h2>
              <form>
                <div className="flex">
                  <input
                    type="text"
                    name="categoryValue"
                    id="add_cat_input"
                    placeholder="Zadajte nazov kategorie"
                    value={this.state.catName}
                    onChange={e => this.setState({ catName: e.target.value })}
                  />
                  <button
                    type="submit"
                    name="add_button"
                    onClick={event => this.onSubmit(event)}
                  >
                    <img
                      src={require("../assets/img/add_icon.svg")}
                      alt="obrazok"
                    />
                    Pridať
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Home;
