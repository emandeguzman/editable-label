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

const editableElementTextInputTemplate = 
`<link rel="stylesheet" href="${dirurl()}/editable_element_text.min.css">
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
     * Called when editable-element goes into edit mode
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
<loading-icon hidden></loading-icon>
<span class="editor" hidden>
    <span class="editor-input"></span>
    <button type="button" class="btnSubmit">&check;</button>
    <button type="button" class="btnCancel">&cross;</button>
    <div class="errmsgbox" hidden=""></div>
</span>`;
customElements.define("editable-element", class extends HTMLElement {
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
//         //#endregion
// 
//         //#region define reference to html elements of this custom element
//         this._loadingIcon;
//         this._controlWrapper;
//         this._errBlock;
//         //#endregion 
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

    //     //#region disabled
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
    //     //#endregion

    //get display(){}
    //set display(val) {}
    //#endregion

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

    //     //#region name
    //     get name() {
    //         return this.getAttribute("data-name") ? this.getAttribute("data-name") : this.id;
    //     }
    //     set name(val) {
    //         this.setAttribute("data-name", val);
    //     }
    //     //#endregion

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

    //     //#region pk
    //     get pk() {
    //         return this.getAttribute("data-pk") ? this.getAttribute("data-pk") : null;
    //     }
    //     set pk(val) {
    //         this.setAttribute("data-pk", val);
    //     }
    //     //#endregion

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

    //     //#region url
    //     get url() {
    //         return this.getAttribute("data-url") ? this.getAttribute("data-url") : null;
    //     }
    //     set url(val) {
    //         this.setAttribute("data-url", val);
    //     }
    //     //#endregion

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

    //#endregion options

    //#region methods
    _hide = (element)=>{
        element.setAttribute("hidden", "hidden");
    }
    _show = (element)=>{
        element.removeAttribute("hidden");
    }
//     inEditMode = ()=>{
//         return this._root.querySelector(".ee-container") ? true : false;
//     }
// 

    _getValue = ()=>{
        return this.hasAttribute("data-value") ? this.getAttribute("data-value") : this.textContent;
    }

    _startEditing = ()=>{
//             if (this.disabled) return;
// 
        this._hide(this._placeholder);
        this._show(this._editor);


        //#region initialize and append editable input element
        this._editorContainer.innerHTML = '';

        const editableInputElementTag = (()=>{
            switch (this.type){
                case 'text':
                    return "editable-elementtext";
                default:
                    return this.type;
            }
        })();
        this._editableInput = document.createElement(editableInputElementTag);
        this._editorContainer.append(this._editableInput);
        //#endregion

        this._editableInput.activate(this.value);

        this._editableInput.addEventListener("submit", this._submitEdit);
        this._editableInput.addEventListener("cancel", this._endEditing);

        //#region clicked outside of ee-element -> remove editable controls and restore to non-edit mode
        window.requestAnimationFrame(()=>{
            let windowClickListener;
            (windowClickListener = () => {
                window.addEventListener(
                    "click",
                    (e)=>{
                        // if (this.inEditMode()) {
                            if (this === e.target.closest("editable-element")) {
                                windowClickListener();
                            }
                            else {
                                this._endEditing();
                            }
                        // }
                    },
                    {once: true}
                );
            })();
        });
        //#endregion


    }

    _endEditing = ()=>{
        this._show(this._placeholder);
        this._hide(this._editor);

            // this.hide(this._loadingIcon);
            // this.show(this._controlWrapper);

            // this._errBlock.textContent = "";
            // this.hide(this._errBlock);

            // this.show(this._placeholder);
            // this.hide(wrapper);
    }

    _submitEdit = ()=>{
        this.value = this._editableInput.value;
        this._endEditing();
    }
    //#endregion methods
    
    connectedCallback() {
        this._root = this;
        // this.attachShadow({mode: 'open'});
        // this._root = this.shadowRoot;

        //get value from either textcontent or data-value attribute (CANNOT USE value ACCESSOR, MUST GET VALUE BEFORE ALTERING ELEMENT)
        const value = this._getValue();

        this._root.innerHTML = editableElementTemplate;

        //#region get reference to elements inside editable container
        this._placeholder = this._root.querySelector('.placeholder');
        this._editor = this._root.querySelector('.editor');
        this._editorContainer = this._root.querySelector('.editor-input');
        //         this._controlWrapper = wrapper.querySelector(".control-group");
        //         this._loadingIcon = wrapper.querySelector(".ee-loading");
        //         this._errBlock = wrapper.querySelector(".ee-error-block");
        // 
        const btnOk = this._root.querySelector(".btnSubmit");
        const btnCancel = this._root.querySelector(".btnCancel");
        //         const inputContainer = wrapper.querySelector(".ee-inputcont");
        //         const btnContainer = wrapper.querySelector(".ee-buttons");
        //#endregion

        //#region set initial value
        this.value = value;
        //         if (this.disabled) {
        //             this.disabled = this.disabled;
        //         }
        //#endregion 
                
        //#region event handlers
        //#region start editing mode on click
        this._placeholder.addEventListener("click", ()=>{
            this._startEditing();
        });
        //#endregion

        //#region submit event handler
//         editableInput.addEventListener("submit", (e)=>submit(e.detail.value));
//         const submit = (val)=>{
//             new Promise(resolve=>{
//                 //#region show loading icon and hide other controls
//                 this.show(this._loadingIcon);
//                 this.hide(this._controlWrapper);
//                 resolve();
//                 //#endregion
//             })
//             .then(() => {
//                 //#region url, pk && name are set -> send a post request to url
//                 if (this.url && this.pk && this.name) {
//                     //#region post to backend
// 
//                     //#region set formdata to send
//                     const formData = new FormData();
//                     //#region set form data value base on params property if set
//                     if (this.params) {
//                         const defdata = {pk:this.pk, name:this.name, value:val};
//                         let d;
//                         try {
//                             switch(typeof this.params) {
//                                 case "function":
//                                     d = this.params(defdata);
//                                 break;
//                                 case "object":
//                                     d = {...defdata, ...this.params};
//                                 break;
//                                 case "string":
//                                     d = {...defdata, ...JSON.parse(this.params)};
//                                 break;
//                                 default:
//                                     throw new Error(`Unexpected param type`);
//                             }
//                             for (const key in d) {
//                                 if (d.hasOwnProperty(key)) {
//                                     if (typeof d[key] == "object") {
//                                         for (const k in d[key]) {
//                                             formData.append(`${key}[${k}]`, `${d[key][k]}`);
//                                         }
//                                     }
//                                     else formData.append(key, d[key]);
//                                 }
//                             }
//                         } catch (error) {
//                             console.error(error);
//                         }
//                     }
//                     //#endregion
//                     //#region else
//                     else {
//                         formData.append("pk", this.pk);
//                         formData.append("name", this.name);
//                         formData.append("value", val);
//                     }
//                     //#endregion
//                     //#endregion
//                     
//                     return fetch(this.url, {
//                         method: "POST",
//                         body: formData
//                     })
//                     .then(res => {
//                         if (res.ok) {
//                             return {newValue: val, response: res};
//                         }
//                         else {
//                             return res.text()
//                             .then(text => {
//                                 throw new Error(text);
//                             })
//                         }
//                     })
//                     .catch(err=>{
//                         throw err;
//                     })
//                     //#endregion
//                 }
//                 //#endregion
//                 //#region else -> just update value
//                 else {
//                     return {newValue: val, response: undefined};
//                 }
//                 //#endregion
//             })
//             .then((saveEventDetail)=>{
//                 //#region set new value and dispatch "save" event
//                 this.value = saveEventDetail.newValue;
//                 this.dispatchEvent(new CustomEvent("save", {
//                     bubbles: true,
//                     composed: true,
//                     detail: saveEventDetail
//                 }));
//                 //#endregion
//             })
//             .then(() => {
//                 //#region restore view (remove edit controls)
//                 this._endEditing();
//                 //#endregion
//             })
//             .catch((err) => {
//                 //#region restore edit mode
//                 this._errBlock.textContent = err.message;
//                 this.show(this._errBlock);
//                 this.hide(this._loadingIcon);
//                 this.show(this._controlWrapper);
//                 window.requestAnimationFrame(() => editableInput.focus());
//                 //#endregion
//             })
//         }
        //#endregion

        btnOk.addEventListener("click", this._submitEdit);
        btnCancel.addEventListener("click", this._endEditing);
        //#endregion event handlers
    }   //connectedCallback end
})

})();
