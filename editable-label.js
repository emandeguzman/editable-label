"use strict";
(()=>{
function dirurl() {
    return Array.from(document.querySelectorAll("script")).find(s=>/\/editable_element\.[^\/]+$/.test(s.src)).src.replace(/\/editable_element\.[^\/]+$/, "");
}

function log() {
    console.groupCollapsed(...arguments);
    console.trace(); // hidden in collapsed group
    console.groupEnd();    
}

// //<link rel="stylesheet" href="${dirurl()}/editable_element_text.min.css">
const editableElementTextInputTemplate = 
`<span>
    <input type="text" value="">
    <span class="clear-x">
        <span></span>
        <span></span>
    </span>
</span>`;
customElements.define("editable-label-text-input", class extends HTMLElement {
    //#region elements
    get _elInput(){return this._root.querySelector('input')}
    // get _elForm(){return this._root.querySelector('form')}
    get _elClearBtn(){return this._root.querySelector('.clear-x')}
    //#endregion

    //#region methods to be implemented by all editable inputs
    get value() {
        return this._elInput.value;
    }
    set value(val) {
        this._elInput.value = val;
    }

    displayValue = (val)=>{
        return val;
    }

    focus() {
        this._elInput.focus();
    }

    _dispatchSubmitEvent = ()=>{
        this.dispatchEvent(new CustomEvent("submit", {
            bubbles: true,
            composed: true,
            detail: {
                value: this._elInput.value
            }
        }));
    }

    _dispatchCancelEvent = ()=>{
        this.dispatchEvent(new CustomEvent("cancel", {
            bubbles: true,
            composed: true,
            detail: {
                reason: "Escape key is pressed."
            }
        }));
    }
    // _dispatchInputEvent = (event)=>{
    //     this.dispatchEvent(event);
    // } 
    //#endregion
    
    connectedCallback() {
        // this.attachShadow({mode: 'open'});
        // this._root = this.shadowRoot;
        this._root = this;

        //preserver text content for possible setting of value
        const textContent = this.textContent;

        this._root.innerHTML = editableElementTextInputTemplate;

        //set value from either textcontent or data-value attribute (CANNOT USE value ACCESSOR, MUST GET VALUE BEFORE ALTERING ELEMENT)
        this.value = this.hasAttribute('data-value') ? this.getAttribute('data-value') : textContent;

        //#region event handlers
        //#region catch form submit event (indicates submit new value)
        // this._elForm.addEventListener("submit", (e)=>{
        //     e.preventDefault();
        //     this._dispatchSubmitEvent();
        // })
        //#endregion
        //#region catch esc key as an alternative cancel
        this._elInput.addEventListener("keyup", (e)=>{
            if (e.key == "Escape" || e.key == "Esc") { // escape key
                this._dispatchCancelEvent();
            }
            else if (e.key == "Enter" || e.key == "Return") {
                this._dispatchSubmitEvent();
            }
        })
        //#endregion
        //#region clear event handler
        this._elClearBtn.addEventListener("click", ()=>{
            this._elInput.value = "";
                this._elInput.focus()
        });
        //#endregion
        //#endregion
    }
});

const editableElementSelectInputTemplate = 
`<span>
    <select></select>
</span>`;
customElements.define("editable-label-select-input", class extends HTMLElement {
    //#region elements
    get _elInput(){return this._root.querySelector('select')}
    //#endregion

    //#region methods to be implemented by all editable inputs
    get value() {
        return this._elInput.value;
    }
    set value(val) {
        this._elInput.value = val;
    }

    set source(val){
        //remove existing option elements
        this._elInput.innerHTML = "";

        val.map(item=>{
            const template = document.createElement("TEMPLATE");
            template.innerHTML = `<option value="${item.value}">${item.text}</option>`
            this._elInput.appendChild(template.content);
        })
    }

    displayValue = (val)=>{
        const options = this._elInput.querySelectorAll(":scope > option");
        for(let i = 0; i < options.length; i++) {
            if (options[i].value == val) return options[i].textContent;
        }
        return '';
    }

    focus() {
        this._elInput.focus();
    }

    // _dispatchSubmitEvent = ()=>{
    //     this.dispatchEvent(new CustomEvent("submit", {
    //         bubbles: true,
    //         composed: true,
    //         detail: {
    //             value: this._elInput.value
    //         }
    //     }));
    // }

    _dispatchCancelEvent = ()=>{
        this.dispatchEvent(new CustomEvent("cancel", {
            bubbles: true,
            composed: true,
            detail: {
                reason: "Escape key is pressed."
            }
        }));
    }
    //#endregion
     
    connectedCallback() {
        // this.attachShadow({mode: 'open'});
        // this._root = this.shadowRoot;
        this._root = this;

        //preserver text content for possible setting of value
        const textContent = this.textContent;

        this._root.innerHTML = editableElementSelectInputTemplate;

        //set value from either textcontent or data-value attribute (CANNOT USE value ACCESSOR, MUST GET VALUE BEFORE ALTERING ELEMENT)
        this.value = this.hasAttribute('data-value') ? this.getAttribute('data-value') : null;

        //#region event handlers
        //#region catch esc key as an alternative cancel
        this._elInput.addEventListener("keyup", (e)=>{
            if (e.key == "Escape" || e.key == "Esc") { // escape key
                this._dispatchCancelEvent();
            }
        })
        //#endregion
        //#endregion
    }
});


const editableElementTemplate = 
`<a class="placeholder" tabindex="0"></a>
<busy-icon></busy-icon>
<span class="editor" style="display:flex;">
    <span class="editor-input"></span>
    <button type="button" class="btnSubmit">&check;</button>
    <button type="button" class="btnCancel">&cross;</button>
    <div class="errmsgbox" style="display:block;"></div>
</span>`;
customElements.define("editable-label", class extends HTMLElement {
    constructor() {
        super();
        this._elementdisplaylist = [];  //for _hide and _show methods
    }

    //#region elements
    get _elPlaceholder(){return this._root.querySelector('.placeholder')}
    get _elEditorWrapper(){return this._root.querySelector('.editor')}
    get _elInputBox(){return this._root.querySelector('.editor-input')}
    get _elInputElement(){return this._root.querySelector('.editor-input > *')}
//     //         this._controlWrapper = wrapper.querySelector(".control-group");
    get _elBusyIcon(){return this._root.querySelector("busy-icon")}
    get _elErrMsgBox(){return this._root.querySelector(".errmsgbox")}
//     //         this._errBlock = wrapper.querySelector(".ee-error-block");
//     //         const inputContainer = wrapper.querySelector(".ee-inputcont");
//     //         const btnContainer = wrapper.querySelector(".ee-buttons");
    get _elCancelBtn(){return this._root.querySelector(".btnCancel")}
    get _elSubmitBtn(){return this._root.querySelector(".btnSubmit")}
    //#endregion

    //#region options
//     /* 
//     ajaxOptions
//     anim
//     autotext
//     defaultValue
//     disabled
//     display
//     */
    get emptyclass() {
        return this.hasAttribute("data-emptyclass") ? this.getAttribute("data-emptyclass") : 'editable-empty';
    }
    set emptyclass(val) {
        this.setAttribute("data-emptyclass", val);
    }

    get emptytext() {
        return this.hasAttribute("data-emptytext") ? this.getAttribute("data-emptytext") : 'Empty';
    }
    set emptytext(val) {
        this.setAttribute("data-emptytext", val);
    }

    get error() {
        return this.__error ? this.__error : (response, newValue)=>response.text();
    }
    set error(val) {
        if (typeof val == "function") this.__error = val;
        else console.error(`Error value must be a function`);
    }

//     /*
//     highlight
//     mode
//     */

    get name() {
        return this.hasAttribute("data-name") ? this.getAttribute("data-name") : this.id;
    }
    set name(val) {
        this.setAttribute("data-name", val);
    }

//     /*
//     onblur
//     */

    get params() {
        return this._params ? this._params : null;
    }
    set params(val) {
        this._params = val;
    }

    get pk() {
        return this.hasAttribute("data-pk") ? this.getAttribute("data-pk") : null;
    }
    set pk(val) {
        this.setAttribute("data-pk", val);
    }

//     /*
//     placement
//     savenochange
//     selector
//     send
//     showbuttons
//     */

    // get source() { // property for select element type
    //     return this._source;
    // }
    set source(val) {
       this._source = val;
        if (this._elInputElement) this._elInputElement.source = val;

        //update displayed value
        this.value = this.value;
    }

    get success() {
        return this.__success ? this.__success : ()=>{};
    }
    set success(val) {
        if (typeof val == "function") this.__success = val;
        else console.error(`Success value must be a function`);
    }
//     /*
//     toggle
//     */

    get type() {
        return this.hasAttribute("data-type") ? this.getAttribute("data-type") : 'text';
    }
    set type(val) {
        this.setAttribute("data-type", val);

        const tagname = (()=>{
            switch (val){
                case 'text':
                    return "editable-label-text-input";
                case 'select':
                    return "editable-label-select-input";
                default:
                    return val;
            }
        })();

        let dataValue = `data-value="${this.value}"`;
        if (this.value === undefined || this.value === null) dataValue = '';
        this._elInputBox.innerHTML = `<${tagname} ${dataValue}></${tagname}>`;

        //#region register event listeners
        this._elInputElement.addEventListener('submit', this._saveChanges);
        this._elInputElement.addEventListener('cancel', this._cancelChanges);
        this._elInputElement.addEventListener('input', ()=>this._errmsg = '');
        //#endregion
    }

//     /*
//     unsavedclass
//     */

    get url() {
        return this.hasAttribute("data-url") ? this.getAttribute("data-url") : null;
    }
    set url(val) {
        this.setAttribute("data-url", val);
    }

    get validate(){
        return this._validate ? this._validate : ()=>{};
    }
    set validate(val) {
        if (typeof val == "function") this._validate = val;
        else console.error(`Validate must be a function`);
    }

    get value() {
        return this.hasAttribute('data-value') ? this.getAttribute('data-value') : null;
    }
    set value(val) {
        if (val === undefined || val === null) this.removeAttribute('data-value');
        else this.setAttribute('data-value', val);

        if (this._elInputElement) this._elPlaceholder.textContent = this._elInputElement.displayValue(val);
        else this._elPlaceholder.textContent = val;

        //emptytext 
        if (this._elPlaceholder.textContent.trim() == '') {
            this._elPlaceholder.textContent = this.emptytext;
            this._elPlaceholder.classList.add(this.emptyclass);
        }
        else {
            this._elPlaceholder.classList.remove(this.emptyclass);
        }
    }

    //#region additional options
//     // FOR TEXT INPUT (TEXT)
//     // clear
//     // escape
//     // inputclass
//     // placeholder
//     // tpl

//     // FOR TEXTAREA 
//     // escape
//     // inputclass
//     // placeholder
//     // rows
//     // tpl

//     // FOR SELECT
//     // escape
//     // inputclass
//     // prepend
//     // sourceCache
//     // sourceError
//     // sourceOptions
//     // tpl

//     // FOR DATE
//     // clear
//     // datepicker
//     // escape
//     // format
//     // inputclass
//     // tpl
//     // viewformat

//     // FOR DATETIME
//     // clear
//     // datetimepicker
//     // escape
//     // format
//     // inputclass
//     // tpl
//     // viewformat
    //#endregion
    //#endregion options

    //#region private options
    set _errmsg(msg){
        if (msg === undefined || msg === null || msg == '') {
            this._elErrMsgBox.textContent = '';
            this._hide(this._elErrMsgBox);
            // this._elErrMsgBox.style.display = "none";
        }
        else {
            this._elErrMsgBox.textContent = msg;
            this._show(this._elErrMsgBox);
            // this._elErrMsgBox.style.display = "block";
        }
    }
    //#endregion

    //#region methods
    _hide = (element)=>{
        //#region save element's current style display setting to be used for when restoring display
        if (element.style.display != 'none') {
            const found = this._elementdisplaylist.find(item=>item.element === element);
            if (found) {
                found.display = element.style.display;
            }
            else {
                const item = {
                    element: element,
                    display: element.style.display
                }
                this._elementdisplaylist.push(item);
            }
        }
        //#endregion

        element.style.display = 'none';
    }
    _show = (element)=>{
        const found = this._elementdisplaylist.find(item=>item.element === element);
        if (found) {
            if (found.display == '') element.style.removeProperty('display');
            else element.style.display = found.display;
        }
        else {
            element.style.removeProperty('display');
        }
    }

//     _getValue = ()=>this.hasAttribute("data-value") ? this.getAttribute("data-value") : this.textContent;

    _startEditing = ()=>{
        this._errmsg = '';
        this._switchMode('edit');
        this._elInputElement.focus();
//         //             if (this.disabled) return;
//         // 
//         this._switchMode('edit')

        //#region initialize and append editable input element
//         this._elInputBox.innerHTML = '';
//         this._errmsg = null;

//         const editableInputElementTag = (()=>{
//             switch (this.type){
//                 case 'text':
//                     return "editable-label-text-input";
//                 case 'select':
//                     return "editable-label-select-input";
//                 default:
//                     return this.type;
//             }
//         })();
//         this._elInputBox.append(document.createElement(editableInputElementTag));
        //#endregion

//         this._elInputElement.activate(this.value);

//         this._elInputElement.addEventListener("submit", this._saveNewValue);
//         this._elInputElement.addEventListener("cancel", ()=>this._switchMode('normal'));

        //#region clicked outside of ee-element -> remove editable controls and restore to non-edit mode
//         window.requestAnimationFrame(()=>{
//             let windowClickListener;
//             (windowClickListener = () => {
//                 window.addEventListener(
//                     "click",
//                     (e)=>{
//                         // if (this.inEditMode()) {
//                             if (this === e.target.closest("editable-label")) {
//                                 windowClickListener();
//                             }
//                             else {
//                                 this._switchMode('normal');
//                             }
//                         // }
//                     },
//                     {once: true}
//                 );
//             })();
//         });
        //#endregion
    }

    _cancelChanges = ()=>{
        if (this._mode != "busy") this._switchMode('normal');
    }

    _saveChanges = async ()=>{
        const oldval = this.value;
        let newval = this._elInputElement.value;

        try {
            this._switchMode('busy');

            //#region validate new value
            const res = (this.validate)(this._elInputElement.value);
            if (typeof res == "string") {
                throw new Error(res);
            }
            //#endregion

            //#region if url is set -> send a post request to url
            if (this.url) {
                //#region pk or name not set -> throw error
                if (!this.pk || !this.name){
                    throw new Error(`Undefined name and primary key (pk)`);
                }
                //#endregion

                //#region set formdata to send
                const formData = (()=>{
                    const formData = new FormData();

                    //#region params is set -> adjust form data base on params value
                    if (this.params) {
                        const defdata = {pk:this.pk, name:this.name, value:newval};
                        let d;
                        // try {
                            switch(typeof this.params) {
                                case "function":
                                    d = this.params(defdata);
                                break;
                                case "object":
                                    d = {...defdata, ...this.params};
                                break;
                                // case "string":
                                //     d = {...defdata, ...JSON.parse(this.params)};
                                // break;
                                default:
                                    throw new Error(`Unexpected "params" type`);
                            }
                            for (const key in d) {
                                if (d.hasOwnProperty(key)) {
                                    if (typeof d[key] == "object") {
                                        for (const k in d[key]) {
                                            formData.append(`${key}[${k}]`, `${d[key][k]}`);
                                        }
                                    }
                                    else formData.append(key, d[key]);
                                }
                            }
                        // } catch (error) {
                        //     console.error(error);
                        // }
                    }
                    //#endregion
                    //#region else just use pk, name and value properties
                    else {
                        formData.append("pk", this.pk);
                        formData.append("name", this.name);
                        formData.append("value", newval);
                    }
                    //#endregion
                    return formData;
                })();
                //#endregion

                //#region send data to backend
                const res = await fetch(this.url, {
                    method: "POST",
                    body: formData
                });

                if (res.ok) {
                    // return {newValue: newval, response: res};
                    const jsonres = await res.json();
                    const result = (this.success)(jsonres, newval);
                    if (typeof result == "string") {
                        throw new Error(result);
                    }
                    else if (typeof result == "object") {
                        if (result.newValue === undefined) throw new Error("newValue must be defined");
                        newval = result.newValue
                    }
                }
                else {
                    const resmsg = await (this.error)(res, newval);
                    throw new Error(resmsg);
                }
                //#endregion
            }
            //#endregion

            //#region update value
            this.value = newval;
            //#endregion

            //#region dispatch "valuechange" event
            this.dispatchEvent(new CustomEvent("valuechange", {
                bubbles: true,
                composed: true,
                detail: {
                    oldValue: oldval,
                    newValue: newval
                }
            }));
            //#endregion

            //#region restore view (remove edit controls)
            this._switchMode('normal');
            //#endregion
        }
        catch (err) {
            //#region error handling
            // log(err, err.message);
            this._errmsg = err.message;
            this._switchMode('edit', false);
            this._elInputElement.focus();
            //#endregion
        }
    }

    _switchMode = (mode, resetInputElementValue = true)=>{
        this._mode = mode;
        this._hide(this._elPlaceholder);
        this._hide(this._elBusyIcon);
        this._hide(this._elEditorWrapper);

        switch(mode){
            case 'edit':
                if (resetInputElementValue) this._elInputElement.value = this.value;
                this._show(this._elEditorWrapper);
            break;
            case 'normal':
                this._show(this._elPlaceholder);
            break;
            case 'busy':
                this._show(this._elBusyIcon);
            break;
        }
    }
     //#endregion methods

    connectedCallback() {
        this._root = this;
        // this.attachShadow({mode: 'open'});
        // this._root = this.shadowRoot;

        //preserver text content for possible setting of value
        const textContent = this.textContent;

        this._root.innerHTML = editableElementTemplate;

        //set value from either textcontent or data-value attribute (CANNOT USE value ACCESSOR, MUST GET VALUE BEFORE ALTERING ELEMENT)
        this.value = this.hasAttribute('data-value') ? this.getAttribute('data-value') : textContent;

        //initialize input element
        this.type = this.hasAttribute('data-type') ? this.getAttribute('data-type') : 'text';

        //hide errmsgbox
        this._hide(this._elErrMsgBox);

        this._switchMode('normal');

        //#region event handlers
        // this._elPlaceholder.addEventListener("click", this._startEditing);                      // placeholder clicked -> start editing mode
        this._elPlaceholder.addEventListener("focus", this._startEditing);
        this._elSubmitBtn.addEventListener("click", this._saveChanges);     // check button clicked -> save new value
        this._elCancelBtn.addEventListener("click", this._cancelChanges);   // cross button clicked -> end editing mode, discarding any changes
        this.addEventListener("focusin", ()=>clearTimeout(this._focusTimeoutId));
        this.addEventListener("focusout", ()=>this._focusTimeoutId = setTimeout(this._cancelChanges, 200));
        //#endregion end event handlers
    }   //connectedCallback end
})
})();
