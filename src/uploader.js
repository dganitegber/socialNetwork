import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.fileSelectedHandler = this.fileSelectedHandler.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        console.log("props from uploader", props);
    }

    fileSelectedHandler(e) {
        this.setState({
            file: e.target.files[0]
        });
        console.log("this.state", this.state.file.name);
    }

    uploadImage(e) {
        console.log("this state", this.state);
        e.preventDefault();

        var formData = new FormData();
        formData.append("file", this.state.file);
        // console.log("formData: ", formData);

        axios
            .post("/upload", formData)
            .then(data => {
                this.props.updateImgUrl(data.data);
            })
            .catch(err => {
                console.log("error in upload: ", err);
            });
    }

    render() {
        var lable = "";
        if (this.state.file == undefined) {
            lable = "Select your Photo";
        } else {
            lable = this.state.file.name;
        }
        return (
            <div className="modalUploader">
                <label className="uploaderLabel">
                    <input
                        className="uploader"
                        type="file"
                        onChange={e => this.fileSelectedHandler(e)}
                        accept="image/*"
                        name="file"
                    />
                    {lable}
                    <button
                        onClick={e => this.uploadImage(e)}
                        className="uploadButton"
                    >
                        Upload
                    </button>
                </label>
            </div>
        );
    }
}
