customElements.define('dw-form', class DwForm extends HTMLFormElement {

  constructor() {
    super();
    this.visibilityData = {};
  }

  connectedCallback () {
    this.schema.forEach(field => {
      let type = field.nodeType || field.type;
      let prepareMethod = 'prepare' + type.capitalize();
      if (this[prepareMethod]) {
        field = this[prepareMethod](field);
      }

      this.processField(field, this);
    });

    this.addEventListener('submit', (event) => {
      event.preventDefault();
    });

    this.updateVisibility();
  }

  processField (field, parent) {
    let type = field.nodeType || field.type;
    let id = field.id ? field.id : (field.value ? field.name + '-' + field.value : field.name);
    let fieldElement = document.createElement('div');
    fieldElement.classList.add('form-item-' + type);
    fieldElement.classList.add('form-item-' + id.replace(/\./g, '-'));
    fieldElement.classList.add('form-item');
    parent.appendChild(fieldElement);

    if (field.label) {
      let label = document.createElement('label');
      label.innerText = field.label;
      label.classList.add('field-label');
      label.setAttribute('for', id);
      fieldElement.appendChild(label);
    }

    if (field.visible) {
      for (let [key, value] of Object.entries(field.visible)) {
        if (!this.visibilityData[key]) {
          this.visibilityData[key] = [];
        }

        this.visibilityData[key].push({
          value: value,
          field: fieldElement
        })
      }
    }

    if (!['radios', 'checkboxes'].includes(type)) {
      let mainElement = document.createElement(field.nodeType || 'input');

      for (let [key, value] of Object.entries(field)) {
        if (!['label', 'nodeType'].includes(key) && key in mainElement) {
          mainElement[key] = value;
        }
      }

      if (['input', 'textarea'].includes(mainElement.nodeName.toLowerCase())) {
        let updateValue = () => {
          index(this.data, field.name, mainElement.value);
          this.updateVisibility();
          this.dispatchEvent(new CustomEvent('change'));
        };

        mainElement.addEventListener('change', updateValue);
        mainElement.addEventListener('keyup', updateValue);

        if (['radio', 'checkbox'].includes(field.type)) {
          let currentValue = index(this.data, field.name);
          mainElement.checked = currentValue === mainElement.value;
        }
        else {
          mainElement.value = index(this.data, field.name);
        }

        mainElement.id = id;
      }

      fieldElement.appendChild(mainElement);
    }

    if (field.suffixLabel) {
      let suffixLabel = document.createElement('label');
      suffixLabel.innerText = field.suffixLabel;
      suffixLabel.classList.add(field.type + '-label');
      suffixLabel.setAttribute('for', id);
      fieldElement.appendChild(suffixLabel);
    }

    if (field.children) {
      field.children.forEach(child => {
        this.processField(child, fieldElement)
      });
    }
  }

  updateVisibility () {
    Object.keys(this.visibilityData).forEach(fieldName => {
      this.visibilityData[fieldName].forEach(visibilityRule => {
        let addOrRemove = index(this.data, fieldName) === visibilityRule.value ? 'remove' : 'add';
        visibilityRule.field.classList[addOrRemove]('hidden');
      });
    });
  }

  /**
   * Prepares a field that is with the type 'radios'
   * Is called dynamically.
   * @param field
   */
  prepareRadios (field) {
    let newFields = [];
    for (let [value, label] of Object.entries(field.options)) {
      newFields.push({
        type: 'radio',
        suffixLabel: label,
        id: field.name + '-' + value,
        value: value,
        name: field.name
      });
    }

    return {
      label: field.label,
      name: field.name,
      children: newFields,
      type: 'radios',
    };
  }

},{extends: 'form'});

String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

function index(obj, is, value) {
  if (typeof is == 'string')
    return index(obj, is.split('.'), value);
  else if (is.length === 1 && value !== undefined)
    return obj[is[0]] = value;
  else if (is.length === 0)
    return obj;
  else
    return index(obj[is[0]], is.slice(1), value);
}