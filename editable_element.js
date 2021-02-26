"use strict";
(()=>{
/*
<span class="editable-container editable-inline">
    <div>
        <div class="editableform-loading" hidden></div>
        <form class="form-inline editableform" style="">
            <div class="control-group">
                <div>
                    <div class="editable-input" style="position: relative;">
                        <input type="text" style="padding-right: 24px;">
                        <span class="editable-clear-x"></span>
                    </div>
                    <div class="editable-buttons">
                        <button type="submit" class="editable-submit">ok</button>
                        <button type="button" class="editable-cancel">cancel</button>
                    </div>
                </div>
                <div class="editable-error-block" hidden></div>
            </div>
        </form>
    </div>
</span>
*/  

function dirurl() {
    return Array.from(document.querySelectorAll("script")).find(s=>/\/editable_element\.[^\/]+$/.test(s.src)).src.replace(/\/editable_element\.[^\/]+$/, "");
}

//<link rel="stylesheet" href="${dirurl()}/editable_element_text.min.css">
const editableElementTextInputTemplate = 
`
<form>
    <input type="text" value="">
    <span class="ee-clear-x">
        <div></div>
        <div></div>
    </span>
</form>`;
customElements.define("editable-elementtext", class extends HTMLElement {
    // constructor() {
    //     super();
    //     this._inputEl;
    // }

    connectedCallback() {
        this.attachShadow({mode: 'open'});
        this._root = this.shadowRoot;
        // this._root = this;

        this._root.innerHTML = editableElementTextInputTemplate;

        //#region define reference to input element parts
        this._inputEl = this._root.querySelector("input");
        const form = this._root.querySelector("form");
        //#endregion

        //#region event handlers

        //#region catch form submit event (indicates submit new value)
        form.addEventListener("submit", (e)=>{
            e.preventDefault();
            this.dispatchEvent(new CustomEvent("submit", {
                bubbles: true,
                composed: true,
                detail: {
                    value: this._inputEl.value
                }
            }));
        })
        //#endregion

        //#region catch esc key as an alternative cancel
        this._inputEl.addEventListener("keyup", (e)=>{
            if (e.key == "Escape" || e.key == "Esc") { // escape key
                    this.dispatchEvent(new CustomEvent("cancel", {
                        bubbles: true,
                        composed: true,
                        detail: {
                            reason: "Escape key is pressed."
                        }
                    }));
            }
        })
        //#endregion

       //#region clear event handler
       this._root.querySelector(".ee-clear-x").addEventListener("click", ()=>{
           this._inputEl.value = "";
           window.requestAnimationFrame(()=>this._inputEl.focus());
       });
       //#endregion

        //#endregion
    }

    //#region methods to be implemented by all editable inputs
    /**
     * Called when editable-label goes into edit mode
     * @param {string} value 
     */
    activate(value) {
        this._inputEl.value = value;
        window.requestAnimationFrame(()=>this._inputEl.focus());
    }

    focus() {
        this._inputEl.focus();
    }

    get value() {
        return this._inputEl.value;
    }
    //#endregion
});


const editableElementTemplate = 
`<a class="placeholder"></a>
<busy-icon hidden></busy-icon>
<span class="editor" hidden>
    <span class="editor-input"></span>
    <button type="button" class="btnSubmit">&check;</button>
    <button type="button" class="btnCancel">&cross;</button>
    <div class="errmsgbox" hidden>errmsg</div>
</span>`;
customElements.define("editable-label", class extends HTMLElement {
    //#region constructor
//     constructor() {
//         super();
//         this._root;
// 
//         //NOTE: placeholder is defined early since it is used when setting this custom element's value
//         this._placeholder = document.createElement("A"); //DO NOT REDEFINE _placeholder
//         this._placeholder.classList.add("placeholder");
// 
//         //#region options holder
//         this._options = {};
//         //# endregion
// 
//         //#region define reference to html elements of this custom element
//         this._busyIcon;
//         this._controlWrapper;
//         this._errBlock;
//         //# endregion 
//     }
    //#endregion 

    //#region options

    //#region ###
    //get ajaxOptions(){}
    //set ajaxOptions(val) {}

    //get anim(){}
    //set anim(val) {}

    //get autotext(){}
    //set autotext(val) {}

    //get defaultValue(){}
    //set defaultValue(val) {}

    //     //#r egion disabled
    //     get disabled() {
    //         const value = this.getAttribute("data-disabled") ? this.getAttribute("data-disabled") : "false";
    //         switch(value.trim().toUpperCase()) {
    //             case "FALSE":
    //             case "0":
    //                 return false;
    //             default:
    //                 return true;
    //         }
    //     }
    //     set disabled(val) {
    //         let newValue = false;
    //         switch(typeof val){
    //             case "boolean":
    //                 newValue = val;
    //             break;
    //             case "string":
    //                 switch(val.trim().toUpperCase) {
    //                     case "FALSE":
    //                     case "0":
    //                         newValue = false;
    //                     break;
    //                     default:
    //                         newValue = true;
    //                 }
    //             break;
    //             case "number":
    //             case "bigint":
    //                 newValue = val == 0 ? false : true;
    //             break;
    //             default:
    //                 throw new Error(`Unexpected parameter type`);
    //         }
    // 
    //         if (newValue) {
    //             this._placeholder.classList.add("disabled");
    //             this.setAttribute("data-disabled", "true");
    //         }
    //         else {
    //             this._placeholder.classList.remove("disabled");
    //             this.setAttribute("data-disabled", "false");
    //         }
    //     }
    //     //#endr egion

    //get display(){}
    //set display(val) {}
    //#endregion ###

    //#region emptyclass
    get emptyclass() {
        return this.hasAttribute("data-emptyclass") ? this.getAttribute("data-emptyclass") : 'editable-empty';
    }
    set emptyclass(val) {
        this.setAttribute("data-emptyclass", val);
    }
    //#endregion

    //#region emptytext
    get emptytext() {
        return this.hasAttribute("data-emptytext") ? this.getAttribute("data-emptytext") : 'Empty';
    }
    set emptytext(val) {
        this.setAttribute("data-emptytext", val);
    }
    //#endregion

    //#region ###
    //get error(){}
    //set error(val) {}

    //get highlight(){}
    //set highlight(val) {}

    //get mode(){}
    //set mode(val) {}

    //#region name
    get name() {
        return this.getAttribute("data-name") ? this.getAttribute("data-name") : this.id;
    }
    set name(val) {
        this.setAttribute("data-name", val);
    }
    //#endregion

    //get onblur(){}
    //set onblur(val) {}

    //     //#region params
    //     get params() {
    //         return this._options.params ? this._options.params : this.getAttribute("data-params") ? this.getAttribute("data-params") : null;
    //     }
    //     set params(val) {
    //         let paramtype;
    //         switch (paramtype = typeof val) {
    //             case "function":
    //                 this._options.params = val;
    //                 this.setAttribute("data-params", `<<function>>`);
    //             break;
    //             case "object":
    //                 this._options.params = val;
    //                 this.setAttribute("data-params", `<<object>>`);
    //             break;
    //             case "string":
    //                 this._options.params = val;
    //                 this.setAttribute("data-params", val);
    //             break;
    //             default:
    //                 console.error(new Error(`"params" cannot be of type ${paramtype}`));
    //         }
    //     }
    //     //#endregion

    //#region pk
    get pk() {
        return this.getAttribute("data-pk") ? this.getAttribute("data-pk") : null;
    }
    set pk(val) {
        this.setAttribute("data-pk", val);
    }
    //#endregion

    //get placement(){}
    //set placement(val) {}

    //get savenochange(){}
    //set savenochange(val) {}

    //get selector(){}
    //set selector(val) {}

    //get send(){}
    //set send(val) {}

    //get showbuttons(){}
    //set showbuttons(val) {}

    //get success(){}
    //set success(val) {}

    //get toggle(){}
    //set toggle(val) {}
    //#endregion 

    //#region type
    get type() {
        return this.hasAttribute("data-type") ? this.getAttribute("data-type") : 'text';
    }
    set type(val) {
        this.setAttribute("data-type", val);
    }
    //#endregion

    //#region ###
    //get unsavedclass(){}
    //set unsavedclass(val) {}
    //#endregion
    
    //#region url
    get url() {
        return this.hasAttribute("data-url") ? this.getAttribute("data-url") : null;
    }
    set url(val) {
        this.setAttribute("data-url", val);
    }
    //#endregion

    //get validate(){}
    //set validate(val) {}

    //#region value
    get value() {
        return this._getValue();
    }
    set value(val) {
        const newval = val.toString();
        this.setAttribute("data-value", newval);
        if (newval.trim().length > 0) {
            this._placeholder.textContent = newval;
            this._placeholder.classList.remove(this.emptyclass);
        }
        else {
            this._placeholder.textContent =  this.emptytext;
            this._placeholder.classList.add(this.emptyclass);
        }
    }
    //#endregion

    //#region ###
    // FOR TEXT INPUT (TEXT)
    // clear
    // escape
    // inputclass
    // placeholder
    // tpl

    // FOR TEXTAREA 
    // escape
    // inputclass
    // placeholder
    // rows
    // tpl

    // FOR SELECT
    // escape
    // inputclass
    // prepend
    // source
    // sourceCache
    // sourceError
    // sourceOptions
    // tpl
    
    // FOR DATE
    // clear
    // datepicker
    // escape
    // format
    // inputclass
    // tpl
    // viewformat

    // FOR DATETIME
    // clear
    // datetimepicker
    // escape
    // format
    // inputclass
    // tpl
    // viewformat
    //#endregion

    //#region private options
    set _errmsg(msg){
        if (msg === undefined || msg === null || msg == '') {
            this._hide(this._root.querySelector(".errmsgbox"));
        }
        else {
            this._root.querySelector(".errmsgbox").textContent = msg;
            this._show(this._root.querySelector(".errmsgbox"));
        }
    }
    //#endregion
    //#endregion options

    //#region elements
    get _placeholder(){return this._root.querySelector('.placeholder')}
    get _editorWrapper(){return this._root.querySelector('.editor')}
    get _inputBox(){return this._root.querySelector('.editor-input')}
    get _inputElement(){return this._root.querySelector('.editor-input > *')}
    //         this._controlWrapper = wrapper.querySelector(".control-group");
    get _busyIcon(){return this._root.querySelector("busy-icon")}
    // get _errMsgBox(){return this._root.querySelector(".errmsgbox")}
    //         this._errBlock = wrapper.querySelector(".ee-error-block");
    //         const inputContainer = wrapper.querySelector(".ee-inputcont");
    //         const btnContainer = wrapper.querySelector(".ee-buttons");
    //#endregion

    //#region methods
    _hide = (element)=>{
        element.setAttribute("hidden", "hidden");
    }
    _show = (element)=>{
        element.removeAttribute("hidden");
    }

    _getValue = ()=>this.hasAttribute("data-value") ? this.getAttribute("data-value") : this.textContent;

    _startEditing = ()=>{
//             if (this.disabled) return;
// 
        this._switchMode('edit')

        //#region initialize and append editable input element
        this._inputBox.innerHTML = '';
        this._errmsg = null;

        const editableInputElementTag = (()=>{
            switch (this.type){
                case 'text':
                    return "editable-elementtext";
                default:
                    return this.type;
            }
        })();
        this._inputBox.append(document.createElement(editableInputElementTag));
        //#endregion

        this._inputElement.activate(this.value);

        this._inputElement.addEventListener("submit", this._saveNewValue);
        this._inputElement.addEventListener("cancel", ()=>this._switchMode('no-edit'));

        //#region clicked outside of ee-element -> remove editable controls and restore to non-edit mode
        window.requestAnimationFrame(()=>{
            let windowClickListener;
            (windowClickListener = () => {
                window.addEventListener(
                    "click",
                    (e)=>{
                        // if (this.inEditMode()) {
                            if (this === e.target.closest("editable-label")) {
                                windowClickListener();
                            }
                            else {
                                this._switchMode('no-edit');
                            }
                        // }
                    },
                    {once: true}
                );
            })();
        });
        //#endregion
    }

    _switchMode = (mode)=>{
        this._hide(this._placeholder);
        this._hide(this._busyIcon);
        this._hide(this._editorWrapper);

        switch(mode){
            case 'edit':
                this._show(this._editorWrapper);
            break;
            case 'no-edit':
                this._show(this._placeholder);
            break;
            case 'busy':
                this._show(this._busyIcon);
            break;
        }
    }

    _saveNewValue = ()=>{
//         const submit = (val)=>{
        //#region show busy icon and hide other controls
        new Promise(resolve=>{
            this._switchMode('busy');
            resolve();
        })
        //#endregion
        //#region get new value to set
        .then(() => {
            //#region if url is set -> send a post request to url
            if (this.url) {
                //#region pk && name must be set
                if (!this.pk || !this.name){
                    throw new Error(`"pk" and "name" must also be set`);
                }
                //#endregion

                //#region set formdata to send
                const formData = (()=>{
                    const formData = new FormData();
                    //                 ////:: set form data value base on params property if set
                    //                 if (this.params) {
                    //                     const defdata = {pk:this.pk, name:this.name, value:val};
                    //                     let d;
                    //                     try {
                    //                         switch(typeof this.params) {
                    //                             case "function":
                    //                                 d = this.params(defdata);
                    //                             break;
                    //                             case "object":
                    //                                 d = {...defdata, ...this.params};
                    //                             break;
                    //                             case "string":
                    //                                 d = {...defdata, ...JSON.parse(this.params)};
                    //                             break;
                    //                             default:
                    //                                 throw new Error(`Unexpected param type`);
                    //                         }
                    //                         for (const key in d) {
                    //                             if (d.hasOwnProperty(key)) {
                    //                                 if (typeof d[key] == "object") {
                    //                                     for (const k in d[key]) {
                    //                                         formData.append(`${key}[${k}]`, `${d[key][k]}`);
                    //                                     }
                    //                                 }
                    //                                 else formData.append(key, d[key]);
                    //                             }
                    //                         }
                    //                     } catch (error) {
                    //                         console.error(error);
                    //                     }
                    //                 }
                    //                 ////::end
                    //                 ////:: else
                    //                 else {
                    formData.append("pk", this.pk);
                    formData.append("name", this.name);
                    formData.append("value", this._inputElement.value);
                    //                 }
                    //                 ////::end
                    //                 ////::end
                    return formData;
                })();
                //#endregion

                //#region send data to backend
                return fetch(this.url, {
                    method: "POST",
                    body: formData
                })
                .then(res => {
                    if (res.ok) {
                        return {newValue: this._inputElement.value, response: res};
                    }
                    else {
                        return res.text()
                        .then(text => {
                            throw new Error(text);
                        })
                    }
                })
                // .catch(err=>{
                //     throw err;
                // })
                //#endregion
            }
            //#endregion
            //#region else -> just update value
            else {
                return {newValue: this._inputElement.value, response: undefined};
            }
            //#endregion
        })
        //#endregion
        //#region save new value and dispatch "save" event
        .then((saveEventDetail)=>{
            console.log(`saveEventDetail`, saveEventDetail)
            this.value = saveEventDetail.newValue;
            // this.dispatchEvent(new CustomEvent("save", {
            this.dispatchEvent(new CustomEvent("change", {
                bubbles: true,
                composed: true,
                detail: saveEventDetail
            }));
        })
        //#endregion
        //#region restore view (remove edit controls)
        .then(() => {
            this._switchMode('no-edit');
        })
        //#endregion
        //#region error handling
        .catch((err) => {
            console.log(err)
            this._errmsg = err.message;
            this._switchMode('edit');
            window.requestAnimationFrame(() => this._inputElement.focus());
        })
        //#endregion
    }

    //#endregion methods
    
    connectedCallback() {
        this._root = this;
        // this.attachShadow({mode: 'open'});
        // this._root = this.shadowRoot;

        //get value from either textcontent or data-value attribute (CANNOT USE value ACCESSOR, MUST GET VALUE BEFORE ALTERING ELEMENT)
        const value = this._getValue();

        this._root.innerHTML = editableElementTemplate;

        ////:: set initial value
        this.value = value;
        //         if (this.disabled) {
        //             this.disabled = this.disabled;
        //         }
        ////::end 
                
        ////:: event handlers
        this._placeholder.addEventListener("click", this._startEditing);                      // placeholder clicked -> start editing mode
        this._root.querySelector(".btnSubmit").addEventListener("click", this._saveNewValue); // check button clicked -> save new value
        this._root.querySelector(".btnCancel").addEventListener("click", ()=>this._switchMode('no-edit'));   // cross button clicked -> end editing mode, discarding any changes
        ////::end event handlers
    }   //connectedCallback end
})

})();
