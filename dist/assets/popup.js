'use strict';
(function() {
const __registry = Object.create(null);
function __define(id, factory) {
  __registry[id] = { factory, exports: undefined };
}
function __require(id) {
  const record = __registry[id];
  if (!record) {
    throw new Error('Module "' + id + '" is not registered.');
  }
  if (record.exports === undefined) {
    const module = { exports: {} };
    const returned = record.factory(module, module.exports, __require);
    record.exports = returned !== undefined ? returned : module.exports;
  }
  return record.exports;
}

__define('@/components/CustomInput.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, openBlock: _openBlock, toDisplayString: _toDisplayString } = window.Vue;


const __sfc__ = {
  __name: 'CustomInput',
  props: {
    label: {
        type: String,
        default: ""
    },
    type: {
        type: String,
        default: "number"
    },
    placeholder: {
        type: String,
        default: ""
    },
    inputId: {
        type: String,
        required: true
    },
    max: {
        type: Number,
        required: false
    },
    min: {
        type: Number,
        required: false
    },
    modelValue: {},
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        required: true
    }
},
  emits: ['inputChangeEvent'],
  setup(__props, { expose: __expose, emit: __emit }) {
  __expose();

/**
 * Defines the emitted event 'inputChangeEvent', which is triggered when the input value changes
 * to notify the parent component with the new input value.
 */
const emit = __emit;

/**
 * Defines the props that the component expects:
 *
 * @prop {string} label - The label text for the input field. Defaults to an empty string if not provided.
 * @prop {string} type - The type of the input field (e.g., "text", "number"). Defaults to "number".
 * @prop {string} placeholder - The placeholder text for the input field. Defaults to an empty string if not provided.
 * @prop {string} inputId - A unique identifier for the input field. This prop is required.
 * @prop {number} [max] - The maximum allowable value for the input field. Optional.
 * @prop {number} [min] - The minimum allowable value for the input field. Optional.
 * @prop {*} modelValue - The current value of the input field, used for two-way binding.
 * @prop {boolean} [required=false] - A Boolean indicating whether the input is required. Defaults to `false` if not provided.
 * @prop {boolean} disabled - A Boolean indicating whether the input field is disabled. This prop is required.
 */
const props = __props;

/**
 * Handles the input event. When the input value changes, this function emits the 'inputChangeEvent'
 * with the updated input value to notify the parent component.
 *
 * @param {Event} event - The input change event triggered by user interaction.
 */
const onInputEvent = (event) => {
    emit('inputChangeEvent', event.target.value)
}

const __returned__ = { emit, props, onInputEvent }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "input-label-container" }
const _hoisted_2 = ["for"]
const _hoisted_3 = { class: "input-container" }
const _hoisted_4 = ["id", "type", "placeholder", "required", "disabled", "max", "min", "value"]

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("label", { for: _ctx.inputId }, _toDisplayString(_ctx.label), 9 /* TEXT, PROPS */, _hoisted_2),
    _createElementVNode("div", _hoisted_3, [
      _createElementVNode("input", {
        id: _ctx.inputId,
        class: "custom-input",
        onInput: _cache[0] || (_cache[0] = (...args) => (_ctx.onInputEvent && _ctx.onInputEvent(...args))),
        type: _ctx.type,
        placeholder: _ctx.placeholder,
        required: _ctx.required,
        disabled: _ctx.disabled,
        max: _ctx.max,
        min: _ctx.min,
        value: _ctx.modelValue
      }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_4)
    ])
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-199bf904246cf36c5c56080e5e6bb46b';
module.exports.default = __sfc__;

});

__define('@/components/CustomButton.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, openBlock: _openBlock, toDisplayString: _toDisplayString } = window.Vue;


const __sfc__ = {
  __name: 'CustomButton',
  props: {
    text: {
        type: String,
        default: ''
    },
    buttonId: {
        type: String,
        required: true
    },
    disabled: {
        type: Boolean,
        required: false
    }
},
  setup(__props, { expose: __expose }) {
  __expose();

/**
 * Defines the props that the component expects:
 *
 * @prop {string} text - The text to be displayed on the button. Defaults to an empty string if not provided.
 * @prop {string} buttonId - A unique identifier for the button. This prop is required.
 * @prop {boolean} [disabled=false] - A Boolean indicating whether the button is disabled. Defaults to `false` if not provided.
 */
const props = __props

const __returned__ = { props }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = ["id", "disabled"]

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("button", {
    id: _ctx.buttonId,
    class: "btn",
    disabled: _ctx.disabled
  }, _toDisplayString(_ctx.text), 9 /* TEXT, PROPS */, _hoisted_1))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-e2a535f56ef686867ba893cb3d68526e';
module.exports.default = __sfc__;

});

__define('@/components/CustomSlider.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, onMounted, openBlock: _openBlock, ref, toDisplayString: _toDisplayString, vModelText: _vModelText, withDirectives: _withDirectives } = window.Vue;



/**
 * Defines the emitted event 'sliderValueChange', which notifies the parent component
 * whenever the slider value changes.
 */

const __sfc__ = {
  __name: 'CustomSlider',
  props: {
    rpm: {
        type: Number,
        required: true
    }
},
  emits: ['sliderValueChange'],
  setup(__props, { expose: __expose, emit: __emit }) {
  __expose();

/** Imports Vue's `onMounted` lifecycle hook and `ref` for creating reactive properties.*/
const emit = __emit;

/**
 * Defines the props that the component expects:
 *
 * @prop {number} rpm - The initial value for the slider representing rounds per minute. This prop is required.
 */
const props = __props;


/**
 * A reactive reference to the slider element in the DOM.
 *
 * @type {Ref<HTMLElement|null>}
 */
const sliderRef = ref(null);

/**
 * A reactive value for the current slider value, initialized with the `rpm` prop.
 *
 * @type {Ref<number>}
 */
const sliderValue = ref(props.rpm);

/**
 * Increases the slider value by 1. If the value exceeds 120, it wraps back to 1.
 * Updates the slider's CSS variable and emits the 'sliderValueChange' event.
 */
const increaseNumber = () => {
    sliderValue.value = (sliderValue.value % 120) + 1
    const slider = sliderRef.value;
    slider.style.setProperty('--slider-value', sliderValue.value);
    emit('sliderValueChange', sliderValue.value);
}

/**
 * Decreases the slider value by 1. If the value goes below 1, it wraps back to 120.
 * Updates the slider's CSS variable and emits the 'sliderValueChange' event.
 */
const decreaseNumber = () => {
    sliderValue.value = sliderValue.value === 1 ? 120 : sliderValue.value - 1;
    const slider = sliderRef.value;
    slider.style.setProperty('--slider-value', sliderValue.value);
    emit('sliderValueChange', sliderValue.value);
}

/**
 * Handles input changes directly from the slider. Updates the internal slider value and
 * emits the 'sliderValueChange' event with the updated value.
 *
 * @param {Event} event - The input change event triggered by user interaction.
 */
const onInputChange = (event) => {
    const newValue = event.target.value;
    const slider = sliderRef.value;
    slider.style.setProperty('--slider-value', newValue);
    emit('sliderValueChange', sliderValue.value);
}

/**
 * `onMounted` lifecycle hook. When the component is mounted, the slider's CSS variable is set
 * to the initial `sliderValue` to reflect the current state of the slider.
 */
onMounted(() => {
    const slider = sliderRef.value;
    slider.style.setProperty('--slider-value', sliderValue.value);
})

const __returned__ = { emit, props, sliderRef, sliderValue, increaseNumber, decreaseNumber, onInputChange, onMounted, ref }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "label-container" }
const _hoisted_2 = { class: "slider-wrapper" }

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", {
    key: _ctx.sliderKey,
    class: "slider-container"
  }, [
    _createElementVNode("div", _hoisted_1, [
      _createElementVNode("p", null, _toDisplayString(_ctx.sliderValue) + " searches/min", 1 /* TEXT */)
    ]),
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.decreaseNumber && _ctx.decreaseNumber(...args))),
        class: "glider-button"
      }, "-"),
      _withDirectives(_createElementVNode("input", {
        type: "range",
        "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.sliderValue) = $event)),
        min: "1",
        max: "120",
        class: "slider",
        ref: "sliderRef",
        onInput: _cache[2] || (_cache[2] = (...args) => (_ctx.onInputChange && _ctx.onInputChange(...args)))
      }, null, 544 /* NEED_HYDRATION, NEED_PATCH */), [
        [_vModelText, _ctx.sliderValue]
      ]),
      _createElementVNode("button", {
        onClick: _cache[3] || (_cache[3] = (...args) => (_ctx.increaseNumber && _ctx.increaseNumber(...args))),
        class: "glider-button"
      }, "+")
    ])
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-b83f132e94a3346a9c33408f31b70d02';
module.exports.default = __sfc__;

});

__define('@/components/CustomLi.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, openBlock: _openBlock, toDisplayString: _toDisplayString } = window.Vue;


const __sfc__ = {
  __name: 'CustomLi',
  props: {
    name: {
        type: String,
        required: true
    },
    rating: {
        type: String,
        required: true
    }
},
  setup(__props, { expose: __expose }) {
  __expose();

/**
 * Defines the props that the component expects:
 *
 * @prop {string} name - The name of the player. This prop is required.
 * @prop {string} rating - The rating of the player. This prop is required.
 */
const props = __props

const __returned__ = { props }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "li-container" }
const _hoisted_2 = { class: "name" }
const _hoisted_3 = { class: "rating" }

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("li", null, [
    _createElementVNode("div", _hoisted_1, [
      _createElementVNode("p", _hoisted_2, _toDisplayString(_ctx.name), 1 /* TEXT */),
      _createElementVNode("p", _hoisted_3, _toDisplayString(_ctx.rating), 1 /* TEXT */)
    ])
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-d21bf5c2d90982c049b2db449f0bced5';
module.exports.default = __sfc__;

});

__define('@/components/PlayerInput.vue', function(module, exports, __require) {
const { createBlock: _createBlock, createCommentVNode: _createCommentVNode, createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, Fragment: _Fragment, normalizeClass: _normalizeClass, openBlock: _openBlock, ref, renderList: _renderList, resolveComponent: _resolveComponent, toDisplayString: _toDisplayString, withKeys: _withKeys, withModifiers: _withModifiers } = window.Vue;
const CustomLi = __require('@/components/CustomLi.vue').default;




/**
 * Defines emitted events:
 * - `inputChangeEvent`: Triggered when the input field value changes.
 * - `selectedPlayerEvent`: Triggered when a player is selected from the suggestions.
 */

const __sfc__ = {
  __name: 'PlayerInput',
  props: {
    label: {
        type: String,
        default: ""
    },
    placeholder: {
        type: String,
        default: ""
    },
    inputId: {
        type: String,
        required: true
    },
    modelValue: {},
    required: {
        type: Boolean,
        default: false
    },
    disabled: {
        type: Boolean,
        required: true
    },
    playerList: {
        type: Array,
        default: () => []
    }

},
  emits: ['inputChangeEvent', 'selectedPlayerEvent'],
  setup(__props, { expose: __expose, emit: __emit }) {
  __expose();

/**
 * Imports `ref` and from Vue to manage reactive data and properties.
 */
const emit = __emit;

/**
 * Defines the props that the component expects:
 *
 * @prop {string} label - The label text for the input field. Defaults to an empty string if not provided.
 * @prop {string} placeholder - The placeholder text for the input field. Defaults to an empty string.
 * @prop {string} inputId - A unique identifier for the input field. This prop is required.
 * @prop {*} modelValue - The current value of the input field, used for two-way binding.
 * @prop {boolean} [required=false] - A flag indicating whether the input is required. Defaults to `false`.
 * @prop {boolean} disabled - A flag indicating whether the input field is disabled. This prop is required.
 * @prop {Array<Object>} playerList - A list of players used to populate the suggestions. Defaults to an empty array.
 */
const props = __props;

/**
 * A reactive reference for the index of the currently highlighted suggestion during keyboard navigation.
 * Initially set to -1 (no suggestion highlighted).
 *
 * @type {Ref<number>}
 */
const highlightedIndex = ref(-1);

/**
 * A reactive reference controlling the visibility of the suggestions list.
 * Initially set to `false` (suggestions list is hidden).
 *
 * @type {Ref<boolean>}
 */
const showSuggestions = ref(false);

/**
 * Handles navigation through the suggestion list using the down arrow key.
 * Moves the highlight to the next suggestion, looping back to the first if at the end.
 */
const onArrowDown = () => {
    if (highlightedIndex.value < props.playerList.length - 1) {
        highlightedIndex.value++;
    } else {
        highlightedIndex.value = 0; // Loop back to the first suggestion
    }
};

/**
 * Handles navigation through the suggestion list using the up arrow key.
 * Moves the highlight to the previous suggestion, looping back to the last if at the beginning.
 */
const onArrowUp = () => {
    if (highlightedIndex.value > 0) {
        highlightedIndex.value--;
    } else {
        highlightedIndex.value = props.playerList.length - 1; // Loop back to the last suggestion
    }
};

/**
 * Handles the selection of a suggestion when the Enter key is pressed.
 * If a suggestion is highlighted, it is selected. If not, the current input value is used.
 */
const onEnter = () => {
    if (highlightedIndex.value >= 0) {
        selectSuggestion(props.playerList[highlightedIndex.value].name);
    } else {
        selectSuggestion(props.modelValue)
    }
};

/**
 * Handles the selection of a suggestion. This can be triggered by a mouse click or pressing Enter.
 * The selected suggestion is emitted through the 'selectedPlayerEvent', and the suggestions list is hidden.
 *
 * @param {string} suggestion - The name of the selected player.
 */
const selectSuggestion = (suggestion) => {
    console.log("Suggestion ", suggestion);
    emit('selectedPlayerEvent', suggestion)
    hideSuggestions(); // Hide the suggestions list after selection
};

/**
 * Hides the suggestions list by setting `showSuggestions` to `false`.
 */
const hideSuggestions = () => {
    showSuggestions.value = false; // Hide the suggestions list
};

/**
 * Handles the input change event. When the user types, the highlighted suggestion is reset,
 * the suggestions list is shown, and the new input value is emitted via 'inputChangeEvent'.
 *
 * @param {Event} event - The input event triggered by typing in the input field.
 */
const onInputEvent = (event) => {
    highlightedIndex.value = -1; // Reset highlighted index when typing
    showSuggestions.value = true; // Show the suggestions list
    emit('inputChangeEvent', event.target.value); // Emit the new input value
}

const __returned__ = { emit, props, highlightedIndex, showSuggestions, onArrowDown, onArrowUp, onEnter, selectSuggestion, hideSuggestions, onInputEvent, ref, CustomLi }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "search-container" }
const _hoisted_2 = { class: "input-label-container" }
const _hoisted_3 = ["for"]
const _hoisted_4 = { class: "input-container" }
const _hoisted_5 = ["id", "value", "placeholder", "required", "disabled"]
const _hoisted_6 = {
  key: 0,
  class: "suggestions-list"
}

function render(_ctx, _cache) {
  const _component_CustomLi = _resolveComponent("CustomLi")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("label", { for: _ctx.inputId }, _toDisplayString(_ctx.label), 9 /* TEXT, PROPS */, _hoisted_3),
      _createElementVNode("div", _hoisted_4, [
        _createElementVNode("input", {
          id: _ctx.inputId,
          type: "text",
          value: _ctx.modelValue,
          placeholder: _ctx.placeholder,
          required: _ctx.required,
          disabled: _ctx.disabled,
          class: "player-input",
          onInput: _cache[0] || (_cache[0] = (...args) => (_ctx.onInputEvent && _ctx.onInputEvent(...args))),
          onKeydown: [
            _cache[1] || (_cache[1] = _withKeys(_withModifiers((...args) => (_ctx.onArrowDown && _ctx.onArrowDown(...args)), ["prevent"]), ["down"])),
            _cache[2] || (_cache[2] = _withKeys(_withModifiers((...args) => (_ctx.onArrowUp && _ctx.onArrowUp(...args)), ["prevent"]), ["up"])),
            _cache[3] || (_cache[3] = _withKeys(_withModifiers((...args) => (_ctx.onEnter && _ctx.onEnter(...args)), ["prevent"]), ["enter"])),
            _cache[4] || (_cache[4] = _withKeys((...args) => (_ctx.hideSuggestions && _ctx.hideSuggestions(...args)), ["esc"]))
          ]
        }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_5)
      ])
    ]),
    _createCommentVNode(" Suggestions List "),
    (_ctx.showSuggestions && _ctx.playerList.length)
      ? (_openBlock(), _createElementBlock("ul", _hoisted_6, [
          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.playerList, (item, index) => {
            return (_openBlock(), _createBlock(_component_CustomLi, {
              key: index,
              class: _normalizeClass({ 'highlighted': index === _ctx.highlightedIndex }),
              onClick: $event => (_ctx.selectSuggestion(item.name)),
              name: item.name,
              rating: item.rating
            }, null, 8 /* PROPS */, ["class", "onClick", "name", "rating"]))
          }), 128 /* KEYED_FRAGMENT */))
        ]))
      : _createCommentVNode("v-if", true)
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-90704ee048158b817fe8f97d7c6f7422';
__sfc__.components = Object.assign({}, __sfc__.components, { 'CustomLi': CustomLi });
module.exports.default = __sfc__;

});

__define('@/components/AutoListCheckBox.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, openBlock: _openBlock } = window.Vue;


const __sfc__ = {
  __name: 'AutoListCheckBox',
  props: {
    checked: {
        type: Boolean,
        required: true
    }
},
  emits: ['checkChangedEvent'],
  setup(__props, { expose: __expose, emit: __emit }) {
  __expose();

/**
 * Defines the emitted event 'checkChangedEvent', which notifies the parent component
 * when the checkbox state changes.
 */
const emit = __emit;

/**
 * Defines the props that the component expects:
 *
 * @prop {boolean} checked - The current checked state of the checkbox.
 */
const props = __props;

/**
 * Handles the checkbox state change event. When the checkbox is checked or unchecked,
 * it emits the 'checkChangedEvent' to notify the parent component of the new state.
 *
 * @param {Event} event - The checkbox change event triggered by user interaction.
 */
const onCheckedChange = (event) => {
    const newValue = event.target.checked;
    emit('checkChangedEvent', newValue);
}

const __returned__ = { emit, props, onCheckedChange }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "auto-list-container" }
const _hoisted_2 = ["checked"]

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _cache[2] || (_cache[2] = _createElementVNode("label", { class: "label" }, "List after purchase", -1 /* HOISTED */)),
    _createElementVNode("div", null, [
      _createElementVNode("input", {
        id: "checkbox",
        type: "checkbox",
        class: "custom-checkbox",
        checked: _ctx.checked,
        onChange: _cache[0] || (_cache[0] = (...args) => (_ctx.onCheckedChange && _ctx.onCheckedChange(...args)))
      }, null, 40 /* PROPS, NEED_HYDRATION */, _hoisted_2),
      _cache[1] || (_cache[1] = _createElementVNode("label", {
        class: "checkbox-label",
        for: "checkbox"
      }, null, -1 /* HOISTED */))
    ])
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-aa6877b896ac1b6afbd281ad3135a403';
module.exports.default = __sfc__;

});

__define('@/components/SnipingResults.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, openBlock: _openBlock, toDisplayString: _toDisplayString } = window.Vue;


const __sfc__ = {
  __name: 'SnipingResults',
  props: {
    searches: {
        type: Number,
        required: true
    },
    buys: {
        type: Number,
        required: true
    },
    fails: {
        type: Number,
        required: true
    }
},
  setup(__props, { expose: __expose }) {
  __expose();

/**
 * Defines the props that the component expects:
 *
 * @property {number} searches - The number of searches performed.
 * @property {number} buys - The number of successful purchases.
 * @property {number} fails - The number of failed purchase attempts.
 */
const props = __props

const __returned__ = { props }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "result-container" }
const _hoisted_2 = { class: "stats-container" }
const _hoisted_3 = { class: "stat" }
const _hoisted_4 = { class: "search-label" }
const _hoisted_5 = { class: "stat" }
const _hoisted_6 = { class: "buy-label" }
const _hoisted_7 = { class: "stat" }
const _hoisted_8 = { class: "fail-label" }

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _cache[3] || (_cache[3] = _createElementVNode("label", { class: "stats" }, "STATS", -1 /* HOISTED */)),
    _cache[4] || (_cache[4] = _createElementVNode("hr", null, null, -1 /* HOISTED */)),
    _createElementVNode("div", _hoisted_2, [
      _createElementVNode("div", _hoisted_3, [
        _cache[0] || (_cache[0] = _createElementVNode("label", null, "Searches: ", -1 /* HOISTED */)),
        _createElementVNode("label", _hoisted_4, _toDisplayString(_ctx.searches), 1 /* TEXT */)
      ]),
      _createElementVNode("div", _hoisted_5, [
        _cache[1] || (_cache[1] = _createElementVNode("label", null, "Buys: ", -1 /* HOISTED */)),
        _createElementVNode("label", _hoisted_6, _toDisplayString(_ctx.buys), 1 /* TEXT */)
      ]),
      _createElementVNode("div", _hoisted_7, [
        _cache[2] || (_cache[2] = _createElementVNode("label", null, "Fails: ", -1 /* HOISTED */)),
        _createElementVNode("label", _hoisted_8, _toDisplayString(_ctx.fails), 1 /* TEXT */)
      ])
    ]),
    _cache[5] || (_cache[5] = _createElementVNode("hr", null, null, -1 /* HOISTED */))
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-e9001ccec5e40db0a8e56dfdf0d94ee7';
module.exports.default = __sfc__;

});

__define('@/components/CustomLog.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, openBlock: _openBlock, ref, toDisplayString: _toDisplayString, watch } = window.Vue;



/**
 * Defines the props that the component expects:
 *
 * @prop {Array} logList - An array containing log messages. Defaults to an empty array if not provided.
 */

const __sfc__ = {
  __name: 'CustomLog',
  props: {
    logList: {
        type: Array,
        default: () => []
    }
},
  setup(__props, { expose: __expose }) {
  __expose();

/** Imports Vue's `ref` and `watch` functions for reactive properties and side effect handling.*/
const props = __props;

/**
 * A reactive reference for the textarea element that displays the logs.
 *
 * @type {Ref<null|HTMLElement>}
 */
const textAreaLog = ref(null);

/**
 * Watches for changes in the 'logList' prop. When the log list is updated,
 * it automatically scrolls the 'textAreaLog' to the bottom to ensure the most recent log is visible.
 *
 * @watch logList - Deep watches the log list for changes.
 */
watch(() => props.logList, () => {
    if (textAreaLog.value) {
        // Update the scrollTop to ensure it scrolls to the bottom
        textAreaLog.value.scrollTop = textAreaLog.value.scrollHeight;
    }
}, {deep: true});

/**
 * Generates the current date in the format DD.MM.YYYY.
 *
 * @returns {string} - The formatted current date as a string.
 */
const getFormattedDate = () => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = now.getFullYear();
    return `${day}.${month}.${year}`;
};

/**
 * Initiates the download of the 'logList' as a text file. The file is named based on the current date,
 * and the content is the 'logList' array joined into a single string with new lines separating each entry.
 *
 * Steps:
 * - Convert 'logList' into a string with each log entry on a new line.
 * - Create a Blob from the log content, generate a download link, and programmatically click the link to trigger the download.
 */
const downloadLog = () => {
    const logContent = props.logList.join("\n");  // Convert logList array to a string
    const blob = new Blob([logContent], {type: "text/plain"});  // Create a Blob object representing the data as a text file
    const date = getFormattedDate();  // Get the current date
    const filename = `log_${date}.txt`;  // Generate the filename with the current date
    const link = document.createElement("a");  // Create a temporary anchor element to download the file
    link.href = URL.createObjectURL(blob);  // Create a URL for the Blob and set it as the href for the anchor element
    link.download = filename;  // Set the download attribute with the dynamically generated filename
    document.body.appendChild(link);  // Append the anchor to the document body
    link.click();  // Programmatically click the link to trigger the download
    document.body.removeChild(link);  // Remove the link after the download
};


const __returned__ = { props, textAreaLog, getFormattedDate, downloadLog, ref, watch }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "log-container" }

function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("textarea", {
      ref: "textAreaLog",
      class: "log",
      rows: "7",
      cols: "50",
      readonly: ""
    }, _toDisplayString(_ctx.logList.join('\n')), 513 /* TEXT, NEED_PATCH */),
    _createElementVNode("label", {
      onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.downloadLog && _ctx.downloadLog(...args)))
    }, _toDisplayString('Download log \u2B73'))
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-a3f406e88c1eaf40772947c297aa105f';
module.exports.default = __sfc__;

});

__define('@/components/ThemeColorButton.vue', function(module, exports, __require) {
const { createElementBlock: _createElementBlock, onMounted, openBlock: _openBlock, ref } = window.Vue;



/**
 * Defines the emitted event 'themeColorChange', which notifies the parent component
 * when the theme colors (primary and secondary) are changed.
 */

const __sfc__ = {
  __name: 'ThemeColorButton',
  props: {
    primaryColor: {
        type: String,
        required: true
    },
    secondaryColor: {
        type: String,
        required: true
    }
},
  emits: ['themeColorChange'],
  setup(__props, { expose: __expose, emit: __emit }) {
  __expose();

/** Imports Vue's `onMounted` and `ref` functions for reactive properties and on mounting rendering.*/
const emit = __emit;

/**
 * Defines the props that the component expects:
 *
 * @property {string} primaryColor - The primary color for the theme. This prop is required.
 * @property {string} secondaryColor - The secondary color for the theme. This prop is required.
 */
const props = __props

/**
 * A reactive reference to the button element.
 *
 * @type {Ref<HTMLElement|null>}
 */
const buttonRef = ref();

/**
 * Lifecycle hook that runs when the component is mounted. It applies a linear gradient background to the button
 * based on the provided `primaryColor` and `secondaryColor` props.
 */
onMounted(() => {
    const button = buttonRef.value;
    button.style.setProperty('background', `linear-gradient(to bottom right, ${props.primaryColor}, ${props.secondaryColor})`)
    console.log("Reached")
});

/**
 * Emits the 'themeColorChange' event with the current `primaryColor` and `secondaryColor` values.
 */
const changeThemeColor = () => {
    emit('themeColorChange', props.primaryColor, props.secondaryColor)
}

const __returned__ = { emit, props, buttonRef, changeThemeColor, onMounted, ref }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



function render(_ctx, _cache) {
  return (_openBlock(), _createElementBlock("button", {
    ref: "buttonRef",
    class: "color-theme-button",
    onClick: _cache[0] || (_cache[0] = (...args) => (_ctx.changeThemeColor && _ctx.changeThemeColor(...args)))
  }, null, 512 /* NEED_PATCH */))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-9441bd6d4c6b866452898b5ee81a644c';
module.exports.default = __sfc__;

});

__define('@/Popup.vue', function(module, exports, __require) {
const { computed, createBlock: _createBlock, createCommentVNode: _createCommentVNode, createElementBlock: _createElementBlock, createElementVNode: _createElementVNode, createTextVNode: _createTextVNode, createVNode: _createVNode, Fragment: _Fragment, normalizeClass: _normalizeClass, onMounted, openBlock: _openBlock, ref, renderList: _renderList, resolveComponent: _resolveComponent, toDisplayString: _toDisplayString, vModelSelect: _vModelSelect, vShow: _vShow, watch, withDirectives: _withDirectives } = window.Vue;
const CustomInput = __require('@/components/CustomInput.vue').default;
const CustomButton = __require('@/components/CustomButton.vue').default;
const CustomSlider = __require('@/components/CustomSlider.vue').default;
const PlayerInput = __require('@/components/PlayerInput.vue').default;
const AutoListCheckBox = __require('@/components/AutoListCheckBox.vue').default;
const SnipingResults = __require('@/components/SnipingResults.vue').default;
const CustomLog = __require('@/components/CustomLog.vue').default;
const ThemeColorButton = __require('@/components/ThemeColorButton.vue').default;



/** Import custom components used in the template for UI elements. */









/**
 * @type {boolean} running - Flag to control whether the bot is currently running.
 * @type {boolean} advancedSettings - Flag to toggle the visibility of advanced settings.
 * @type {string} playerName - The name of the current player being searched.
 * @type {Array<Object>} nameList - List of player names and their ratings.
 * @type {number|undefined} searchLimit - The maximum number of searches allowed.
 * @type {number|undefined} minBuyNow - The minimum 'Buy Now' price for purchasing.
 * @type {number|undefined} maxBuyNow - The maximum 'Buy Now' price for purchasing.
 * @type {number|undefined} minListPrice - The minimum listing price when selling players.
 * @type {number|undefined} maxListPrice - The maximum listing price when selling players.
 * @type {number|undefined} searchResultDelay - The delay in milliseconds for search results to appear.
 * @type {number|undefined} confirmDialogDelay - The delay in milliseconds for confirming dialogs.
 * @type {number|undefined} confirmPurchaseDelay - The delay in milliseconds before confirming purchases.
 * @type {number} rpm - The number of rounds per minute for search iterations.
 * @type {boolean} autoListChecked - Flag to determine if auto-listing is enabled.
 * @type {number} searches - Counter for the number of search iterations.
 * @type {number} buys - Counter for successful purchases.
 * @type {number} fails - Counter for failed purchase attempts.
 * @type {Array<string>} logList - List of log entries tracking actions and events.
 * @type {number|undefined} profitRef - Reference to display calculated profit from sales.
 * @type {number} sliderKey - Key used to track the state of the custom slider for RPM.
 */
const PRICE_REFRESH_INTERVAL_MS = 5 * 60 * 1000;

const __sfc__ = {
  __name: 'Popup',
  setup(__props, { expose: __expose }) {
  __expose();

/** Imports Vue's `onMounted` lifecycle hook and `ref` for reactive data. */
const running = ref(false);
const advancedSettings = ref(false);
const playerName = ref('');
const nameList = ref([]);
const searchLimit = ref();
const purchaseLimit = ref();
const minBuyNow = ref();
const maxBuyNow = ref();
const minListPrice = ref();
const maxListPrice = ref();
const searchResultDelay = ref();
const confirmDialogDelay = ref();
const confirmPurchaseDelay = ref();
const rpm = ref(60);
const autoListChecked = ref(false);
const searches = ref(0);
const buys = ref(0);
const fails = ref(0);
const logList = ref([]);
const profitRef = ref();
const sliderKey = ref(0);
const pricePlatform = ref('ps');
const trackedPlayers = ref([]);
const lastPriceRefresh = ref();
const priceTrackerLoading = ref(false);

const tabs = [
    {id: 'autobuyer', label: 'Autobuyer'},
    {id: 'watchlist', label: 'Watchlist'},
    {id: 'fakebins', label: 'Fakebins'}
];

const activeTab = ref('autobuyer');
const selectedFakebinKey = ref('');

const coinFormatter = new Intl.NumberFormat(undefined, {maximumFractionDigits: 0});

const canTrackPrice = computed(() => !!(playerName.value && playerName.value.trim()));

const formattedLastRefresh = computed(() => formatTimestamp(lastPriceRefresh.value));
const formattedNextRefresh = computed(() => {
    if (!lastPriceRefresh.value) {
        return 'Pending…';
    }

    return formatTimestamp(lastPriceRefresh.value + PRICE_REFRESH_INTERVAL_MS);
});

const fakebinPlayers = computed(() =>
    (trackedPlayers.value || []).filter((player) => player?.fakebin?.active)
);

const selectedFakebin = computed(() => {
    if (!selectedFakebinKey.value) {
        return null;
    }

    return fakebinPlayers.value.find((player) => player.storageKey === selectedFakebinKey.value) || null;
});

/**
 * Formats a timestamp into a locale string suitable for UI display.
 *
 * @param {number|undefined|null} timestamp
 * @returns {string}
 */
const formatTimestamp = (timestamp) => {
    if (!timestamp) {
        return 'Never';
    }

    try {
        return new Date(timestamp).toLocaleString();
    } catch (error) {
        console.warn('Failed to format timestamp', timestamp, error);
        return '—';
    }
};

/**
 * Formats a coin value using the shared formatter.
 *
 * @param {number|string|undefined|null} value
 * @returns {string}
 */
const formatCoins = (value) => {
    if (value === undefined || value === null || value === '') {
        return '—';
    }

    const numeric = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]+/g, ''));
    if (!Number.isFinite(numeric)) {
        return '—';
    }

    return coinFormatter.format(Math.round(numeric));
};

/**
 * Formats the latest change for a tracked player.
 *
 * @param {{absolute?: number, percent?: number, direction?: string}|undefined} change
 * @returns {string}
 */
const formatChange = (change) => {
    if (!change || change.direction === 'flat' || !change.absolute) {
        return 'No major change';
    }

    const absolute = formatCoins(Math.abs(change.absolute));
    const percentValue = Number.isFinite(change.percent) ? Math.abs(change.percent).toFixed(2) : '0.00';
    const directionSymbol = change.direction === 'increase' ? '▲' : '▼';
    return `${directionSymbol} ${absolute} (${percentValue}%)`;
};

const pushLogEntry = (message) => {
    logList.value.push(`[${new Date().toLocaleString()}] ${message}`);
};

/**
 * Request the full set of tracked Futbin players from the background service worker.
 */
const requestTrackedPlayers = () => {
    try {
        chrome.runtime.sendMessage({action: 'getTrackedPlayers'}, (response) => {
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Failed to load tracked Futbin players', runtimeError);
                return;
            }

            if (!response?.success) {
                console.warn('Failed to load tracked Futbin players', response?.message);
                return;
            }

            trackedPlayers.value = response.players || [];
            lastPriceRefresh.value = response.lastRefresh || undefined;
            syncFakebinSelection();
        });
    } catch (error) {
        console.error('Failed to request Futbin players', error);
    }
};

/**
 * Sends a Futbin tracking request to the background worker.
 *
 * @param {boolean} silent - When true, avoid logging success/error messages in the UI log.
 * @returns {Promise<{success: boolean, message?: string, player?: any}>}
 */
const sendTrackPlayerMessage = (silent = false) => {
    const trimmedName = playerName.value ? playerName.value.trim() : '';
    if (!trimmedName) {
        return Promise.resolve({success: false, message: 'Player name is required'});
    }

    return new Promise((resolve) => {
        try {
            chrome.runtime.sendMessage({
                action: 'trackPlayerPrice',
                name: trimmedName,
                platform: pricePlatform.value
            }, (response) => {
                const runtimeError = chrome.runtime.lastError;
                if (runtimeError) {
                    if (!silent) {
                        logList.value.push(`[${new Date().toLocaleString()}] Futbin tracking error: ${runtimeError.message}`);
                    }
                    resolve({success: false, message: runtimeError.message});
                    return;
                }

                if (!response?.success) {
                    if (!silent) {
                        logList.value.push(`[${new Date().toLocaleString()}] Futbin tracking error: ${response?.message || 'Unknown error'}`);
                    }
                    resolve({success: false, message: response?.message});
                    return;
                }

                if (!silent) {
                    const trackedPlayer = response.player;
                    const platformLabel = (pricePlatform.value || 'ps').toUpperCase();
                    logList.value.push(`[${new Date().toLocaleString()}] Tracking ${trackedPlayer?.name || trimmedName} (${platformLabel}) on Futbin`);
                }

                resolve({success: true, player: response.player});
            });
        } catch (error) {
            if (!silent) {
                logList.value.push(`[${new Date().toLocaleString()}] Futbin tracking error: ${error.message || error}`);
            }
            resolve({success: false, message: error.message || String(error)});
        }
    });
};

/**
 * Starts tracking the currently selected player on Futbin.
 */
const trackFutbinPrice = async () => {
    if (!canTrackPrice.value || priceTrackerLoading.value) {
        return;
    }

    priceTrackerLoading.value = true;
    const result = await sendTrackPlayerMessage(false);
    priceTrackerLoading.value = false;
    if (result.success) {
        requestTrackedPlayers();
    }
};

/**
 * Triggers an on-demand refresh of the tracked Futbin price data.
 */
const manualRefreshTrackedPlayers = () => {
    if (priceTrackerLoading.value) {
        return;
    }

    priceTrackerLoading.value = true;
    try {
        chrome.runtime.sendMessage({action: 'refreshTrackedPlayersNow'}, (response) => {
            priceTrackerLoading.value = false;
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Futbin refresh failed', runtimeError);
                logList.value.push(`[${new Date().toLocaleString()}] Futbin refresh error: ${runtimeError.message}`);
                return;
            }

            if (!response?.success) {
                logList.value.push(`[${new Date().toLocaleString()}] Futbin refresh error: ${response?.message || 'Unknown error'}`);
                return;
            }

            logList.value.push(`[${new Date().toLocaleString()}] Futbin watchlist refreshed on demand`);
            requestTrackedPlayers();
        });
    } catch (error) {
        priceTrackerLoading.value = false;
        console.error('Futbin refresh failed', error);
        logList.value.push(`[${new Date().toLocaleString()}] Futbin refresh error: ${error.message || error}`);
    }
};

/**
 * Removes a tracked Futbin player from the watchlist.
 *
 * @param {any} player
 */
const removeTrackedPlayer = (player) => {
    if (!player || !player.storageKey || priceTrackerLoading.value) {
        return;
    }

    priceTrackerLoading.value = true;
    try {
        chrome.runtime.sendMessage({action: 'untrackPlayer', storageKey: player.storageKey}, (response) => {
            priceTrackerLoading.value = false;
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Failed to remove Futbin tracker', runtimeError);
                logList.value.push(`[${new Date().toLocaleString()}] Failed to remove Futbin tracker: ${runtimeError.message}`);
                return;
            }

            if (!response?.success) {
                logList.value.push(`[${new Date().toLocaleString()}] Failed to remove Futbin tracker: ${response?.message || 'Unknown error'}`);
                return;
            }

            const platformLabel = player.platform ? player.platform.toUpperCase() : 'PS';
            logList.value.push(`[${new Date().toLocaleString()}] Stopped tracking ${player.name || 'player'} (${platformLabel}) on Futbin`);
            requestTrackedPlayers();
        });
    } catch (error) {
        priceTrackerLoading.value = false;
        console.error('Failed to remove Futbin tracker', error);
        logList.value.push(`[${new Date().toLocaleString()}] Failed to remove Futbin tracker: ${error.message || error}`);
    }
};

const syncFakebinSelection = () => {
    const activePlayers = fakebinPlayers.value;
    if (!activePlayers.length) {
        if (selectedFakebinKey.value) {
            selectedFakebinKey.value = '';
        }
        return;
    }

    if (!activePlayers.some((player) => player.storageKey === selectedFakebinKey.value)) {
        selectedFakebinKey.value = activePlayers[0].storageKey;
    }
};

const setActiveTab = (tabId) => {
    if (tabs.some((tab) => tab.id === tabId)) {
        activeTab.value = tabId;
    }
};

const toggleFakebin = (player) => {
    if (!player || !player.storageKey || priceTrackerLoading.value) {
        return;
    }

    const nextState = !player.fakebin?.active;
    priceTrackerLoading.value = true;

    try {
        chrome.runtime.sendMessage({
            action: 'setFakebinStatus',
            storageKey: player.storageKey,
            active: nextState
        }, (response) => {
            priceTrackerLoading.value = false;
            const runtimeError = chrome.runtime.lastError;
            if (runtimeError) {
                console.error('Failed to update fakebin status', runtimeError);
                pushLogEntry(`Fakebin toggle error: ${runtimeError.message}`);
                return;
            }

            if (!response?.success) {
                pushLogEntry(`Fakebin toggle error: ${response?.message || 'Unknown error'}`);
                return;
            }

            pushLogEntry(`${nextState ? 'Enabled' : 'Disabled'} fakebin for ${player.name || 'player'}`);
            requestTrackedPlayers();
        });
    } catch (error) {
        priceTrackerLoading.value = false;
        console.error('Failed to update fakebin status', error);
        pushLogEntry(`Fakebin toggle error: ${error.message || error}`);
    }
};

const selectFakebin = (player) => {
    if (!player?.fakebin?.active) {
        return;
    }

    selectedFakebinKey.value = player.storageKey;
};

const applyFakebinToAutobuyer = async () => {
    const player = selectedFakebin.value;
    if (!player) {
        return;
    }

    const priceCandidate = player.fakebin?.lastAppliedPrice ?? player.lastPrice;
    const numericPrice = typeof priceCandidate === 'number' ? priceCandidate : Number(String(priceCandidate).replace(/[^\d.-]+/g, ''));
    const resolvedPrice = Number.isFinite(numericPrice) ? Math.max(0, Math.round(numericPrice)) : null;

    try {
        if (player.name) {
            await onPlayerSelected(player.name);
        }

        if (resolvedPrice !== null) {
            await onMinBuyNowChange(resolvedPrice);
            await onMaxBuyNowChange(resolvedPrice);
            onMinListPriceChange(resolvedPrice);
            onMaxListPriceChange(resolvedPrice);
            pushLogEntry(`Using Futbin fakebin for ${player.name || 'player'} at ${formatCoins(resolvedPrice)} coins`);
        } else {
            pushLogEntry(`Unable to apply fakebin price for ${player.name || 'player'}`);
        }
    } catch (error) {
        console.error('Failed to apply fakebin to autobuyer', error);
        pushLogEntry(`Failed to apply fakebin for ${player.name || 'player'}: ${error.message || error}`);
    }
};

watch(pricePlatform, (newValue) => {
    const normalized = (newValue || 'ps').toLowerCase();
    if (normalized !== newValue) {
        pricePlatform.value = normalized;
        return;
    }

    chrome.storage.local.set({pricePlatform: normalized}, function () {
    });
});

watch(fakebinPlayers, () => {
    syncFakebinSelection();
});

watch(activeTab, (newTab) => {
    chrome.storage.local.set({popupActiveTab: newTab}, function () {
    });
});

watch(selectedFakebinKey, (newKey) => {
    chrome.storage.local.set({selectedFakebinKey: newKey || null}, function () {
    });
});

/**
 * Generates a Futbin search link for the currently selected player. When no player
 * has been selected yet, the link falls back to the generic player overview page.
 *
 * @type {import('vue').ComputedRef<string>}
 */
const futbinLink = computed(() => {
    const trimmedName = playerName.value ? playerName.value.trim() : '';
    const baseUrl = 'https://www.futbin.com/25/players';

    if (!trimmedName) {
        return baseUrl;
    }

    return `${baseUrl}?page=1&search=${encodeURIComponent(trimmedName)}`;
});

// Log current URL and pathname in the console for debugging purposes
console.log("Current URL:", window.location.href); // Full URL of the current page
console.log("Current Pathname:", window.location.pathname); // Pathname (after the domain)

// Audio elements for success and failure actions
const sniperHeadShotAudio = new Audio('../assets/SniperHeadShot.MP3')
const sniperMissAudio = new Audio('../assets/SniperMiss.MP3')

/**
 * Updates the player name and sends a message to the content script when the player input changes.
 *
 * @param {string} newValue - The new value of the player name.
 */
const onPlayerInputChange = async (newValue) => {
    playerName.value = newValue
    await chrome.storage.local.set({name: newValue}, function () {
    });
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'inputChange', value: playerName.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Updates the search limit and stores the value in Chrome local storage.
 *
 * @param {number} newValue - The new search limit.
 */
const onSearchLimitChange = (newValue) => {
    searchLimit.value = newValue
    chrome.storage.local.set({searchLimit: newValue}, function () {
    });
}

/**
 * Updates the search purchase limit and stores the value in Chrome local storage.
 *
 * @param {number} newValue - The new search limit.
 */
const onPurchaseLimitChange = (newValue) => {
    purchaseLimit.value = newValue;
    chrome.storage.local.set({purchaseLimit: newValue}, function () {
    });
}

/**
 * Updates the min buy now price, stores it, and sends the updated value to the content script.
 *
 * @param {number} newValue - The new max buy now price.
 */
const onMinBuyNowChange = async (newValue) => {
    minBuyNow.value = newValue;
    chrome.storage.local.set({minBuyNow: newValue}, function () {
    });
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'minBuyNowChange', value: minBuyNow.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Updates the max buy now price, stores it, and sends the updated value to the content script.
 *
 * @param {number} newValue - The new max buy now price.
 */
const onMaxBuyNowChange = async (newValue) => {
    maxBuyNow.value = newValue;
    chrome.storage.local.set({maxBuyNow: newValue}, function () {
    });
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'maxBuyNowChange', value: maxBuyNow.value});
    } else {
        console.error("No active tab found. ")
    }

    // Updates the profit display based on the calculated profit
    if (maxBuyNow.value && maxListPrice.value) {
        const profitParagraph = profitRef.value
        const profit = eaAfterTax(maxBuyNow.value, maxListPrice.value);
        profitParagraph.style.setProperty('color', profit > 0 ? 'chartreuse' : profit < 0 ? '#ef4765' : 'white');
    }
}

/**
 * Handles player selection, updates the player name, and sends a message to the content script.
 *
 * @param {string} newValue - The new selected player name.
 */
const onPlayerSelected = async (newValue) => {
    playerName.value = newValue
    await chrome.storage.local.set({name: newValue}, function () {
    });
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'playerSelected', value: playerName.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Toggles the visibility of advanced settings.
 */
const onAdvancedSettingsPressed = () => {
    advancedSettings.value = !advancedSettings.value;
}

/**
 * Updates the auto-listing checkbox value and stores it in Chrome local storage.
 *
 * @param {boolean} newValue - The new value for the auto-list checkbox.
 */
const onCheckedChanged = (newValue) => {
    autoListChecked.value = newValue
    chrome.storage.local.set({autoListChecked: newValue}, function () {
    });
    setTimeout(() => {
        if (maxBuyNow.value && maxListPrice.value) {
            const profitParagraph = profitRef.value
            const profit = eaAfterTax(maxBuyNow.value, maxListPrice.value);
            profitParagraph.style.setProperty('color', profit > 0 ? 'chartreuse' : profit < 0 ? '#ef4765' : 'white');
        }
    }, 50)
}

/**
 * Updates the minimum listing price and stores it in Chrome local storage.
 *
 * @param {number} newValue - The new minimum listing price.
 */
const onMinListPriceChange = (newValue) => {
    minListPrice.value = newValue;
    chrome.storage.local.set({minListPrice: newValue}, function () {
    });
}

/**
 * Updates the maximum listing price, recalculates profit, and updates the profit display.
 *
 * @param {number} newValue - The new maximum listing price.
 */
const onMaxListPriceChange = (newValue) => {
    maxListPrice.value = newValue;
    chrome.storage.local.set({maxListPrice: newValue}, function () {
    });
    setTimeout(() => {
        if (maxBuyNow.value && maxListPrice.value) {
            const profitParagraph = profitRef.value
            const profit = eaAfterTax(maxBuyNow.value, maxListPrice.value);
            profitParagraph.style.setProperty('color', profit > 0 ? 'chartreuse' : profit < 0 ? '#ef4765' : 'white');
        }
    }, 50)
}

/**
 * Clears all input fields and resets default values.
 */
const onClearAllClicked = async () => {
    playerName.value = null;
    searchLimit.value = null;
    purchaseLimit.value = null;
    minBuyNow.value = null;
    maxBuyNow.value = null;
    autoListChecked.value = false;
    minListPrice.value = null;
    maxListPrice.value = null;
    rpm.value = 60;
    sliderKey.value++;

    // Resets chrome local storage
    await chrome.storage.local.set({
        name: null,
        searchLimit: '',
        purchaseLimit: '',
        minBuyNow: null,
        maxBuyNow: null,
        autoListChecked: false,
        minListPrice: null,
        maxListPrice: null,
        rpm: 60
    }, function () {
        console.log('All values have been reset to local storage.');
    });
}

/**
 * Updates the RPM value and sends a message to the content script.
 *
 * @param {number} newValue - The new RPM value.
 */
const onSliderValueChange = async (newValue) => {
    rpm.value = newValue;
    chrome.storage.local.set({rpm: newValue}, function () {
    });
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'rpmChange', value: rpm.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Updates the search result delay and sends a message to the content script.
 *
 * @param {number} newValue - The new search result delay in milliseconds.
 */
const onSearchResultDelayChange = async (newValue) => {
    searchResultDelay.value = newValue;
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'searchResultDelay', value: searchResultDelay.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Updates the confirm dialog delay and sends a message to the content script.
 *
 * @param {number} newValue - The new confirm dialog delay in milliseconds.
 */
const onConfirmDialogDelayChange = async (newValue) => {
    confirmDialogDelay.value = newValue;
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'confirmDialogDelay', value: confirmDialogDelay.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Updates the confirm purchase delay and sends the updated value to the content script.
 *
 * @param {number} newValue - The new confirm purchase delay in milliseconds.
 */
const onCheckPurchaseDelayChange = async (newValue) => {
    confirmPurchaseDelay.value = newValue;
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'confirmPurchaseDelay', value: confirmDialogDelay.value});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Calculates profit after EA tax (5% deduction on sales).
 *
 * @param {number} buyPrice - The purchase price of the item.
 * @param {number} listPrice - The selling price of the item.
 * @returns {number} - The profit after the 5% EA tax is deducted.
 */
const eaAfterTax = (buyPrice, listPrice) => {
    const profit = listPrice * 0.95 - buyPrice;
    return Math.round(profit);
};

/**
 * Starts the search process by sending a message to the content script.
 */
const startSearch = async () => {
    running.value = true;
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {
            action: 'startSearch',
            searchLimit: searchLimit.value,
            purchaseLimit: purchaseLimit.value,
            rpm: rpm.value,
            checked: autoListChecked.value,
            minList: minListPrice.value,
            maxList: maxListPrice.value,
            searchResultDelay: searchResultDelay.value,
            confirmDialogDelay: confirmDialogDelay.value,
            confirmPurchaseDelay: confirmPurchaseDelay.value
        });
        logList.value.push(`[${new Date().toLocaleString()}] Bot started`);
        if (canTrackPrice.value) {
            sendTrackPlayerMessage(true).then((result) => {
                if (result.success) {
                    requestTrackedPlayers();
                }
            });
        }
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Stops the search process by sending a 'stopSearch' message to the content script.
 */
const stopSearch = async () => {
    running.value = false;
    let [tab] = await chrome.tabs.query({
        active: true, currentWindow: true
    });
    if (tab) {
        chrome.tabs.sendMessage(tab.id, {action: 'stopSearch'});
    } else {
        console.error("No active tab found. ")
    }
}

/**
 * Changes the theme colors by updating the CSS variables and saving the selected theme to Chrome storage.
 *
 * @param {string} primaryColor - The primary theme color.
 * @param {string} secondaryColor - The secondary theme color.
 */
const changeThemeColors = (primaryColor, secondaryColor) => {
    document.documentElement.style.setProperty('--primary-color', primaryColor);
    document.documentElement.style.setProperty('--secondary-color', secondaryColor);
    const colorTheme = {primaryColor: primaryColor, secondaryColor: secondaryColor}
    chrome.storage.local.set({theme: colorTheme}, function () {
        console.log('Theme colors is saved to local storage.');
    });
};

/**
 * Fetches theme and search-related settings from Chrome storage and applies them to the UI.
 * This function is triggered when the component is mounted.
 */
onMounted(async () => {
    // Retrieve the 'theme' object from Chrome storage
    chrome.storage.local.get(['theme'], function (result) {
        if (result.theme) {
            const {primaryColor, secondaryColor} = result.theme;
            // Apply the theme colors to CSS variables
            document.documentElement.style.setProperty('--primary-color', primaryColor);
            document.documentElement.style.setProperty('--secondary-color', secondaryColor);
            console.log('Theme loaded and applied:', primaryColor, secondaryColor);
        } else {
            console.error('No theme found in storage.');
        }
    });

    // Retrieve various settings from Chrome storage and insert them to the global variables
    await chrome.storage.local.get(['name', 'searchLimit', 'purchaseLimit', 'minBuyNow', 'maxBuyNow', 'autoListChecked', 'minListPrice', 'maxListPrice', 'rpm', 'pricePlatform', 'popupActiveTab', 'selectedFakebinKey'], function (result) {
        playerName.value = result.name || undefined;
        if (result.name) onPlayerSelected(result.name);
        searchLimit.value = result.searchLimit || undefined;
        purchaseLimit.value = result.purchaseLimit || undefined;
        minBuyNow.value = result.minBuyNow || undefined;
        maxBuyNow.value = result.maxBuyNow || undefined;
        onMaxBuyNowChange(result.maxBuyNow)
        autoListChecked.value = result.autoListChecked !== undefined ? result.autoListChecked : false;
        minListPrice.value = result.minListPrice || undefined;
        maxListPrice.value = result.maxListPrice || undefined;
        rpm.value = result.rpm || 60;
        pricePlatform.value = (result.pricePlatform || 'ps').toLowerCase();
        const storedTab = tabs.find((tab) => tab.id === result.popupActiveTab)?.id;
        if (storedTab) {
            activeTab.value = storedTab;
        }
        if (typeof result.selectedFakebinKey === 'string') {
            selectedFakebinKey.value = result.selectedFakebinKey;
        }
        sliderKey.value++;
    });

    requestTrackedPlayers();
});

/**
 * Listens for incoming messages from the content script and handles various actions.
 *
 * @param {Object} request - The message payload.
 * @param {Object} sender - The message sender information.
 * @param {Function} sendResponse - Callback to send a response to the sender.
 */
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    /**
     * Handles the 'updateNames' action which updates the UI with the list of player names
     * received from the content script.
     */
    if (request.action === 'updateNames') {

        // Sets the name list array from content script
        nameList.value = request.list;
        sendResponse({success: true, message: 'successful'})
    }

    /**
     * Handles the 'finishedSearch' action which stops the search process by setting the 'running' flag to false
     * and logs the event in the logList.
     */
    else if (request.action === 'finishedSearch') {
        running.value = false
        logList.value.push(`[${new Date().toLocaleString()}] Bot stopped`);
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'reachedSearchLimit' action which stops the search process when the defined search limit is reached.
     * It updates the 'running' flag to false and logs the event in the logList along with the search limit reached.
     */
    else if (request.action === 'reachedSearchLimit') {
        running.value = false
        logList.value.push(`[${new Date().toLocaleString()}] Bot stopped by search limit ${searchLimit.value}`);
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'reachedPurchaseLimit' action which stops the search process when the defined search limit is reached.
     * It updates the 'running' flag to false and logs the event in the logList along with the search limit reached.
     */
    else if (request.action === 'reachedPurchaseLimit') {
        running.value = false
        logList.value.push(`[${new Date().toLocaleString()}] Bot stopped by purchased limit ${purchaseLimit.value}`);
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'searched' action which increments the 'searches' counter whenever a search iteration is completed.
     */
    else if (request.action === 'searched') {
        searches.value++;
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'bought' action which increments the 'buys' counter when a player is successfully purchased,
     * logs the purchase details in the logList, and plays the 'sniperHeadShotAudio' sound.
     */
    else if (request.action === 'bought') {
        buys.value++;
        logList.value.push(`[${new Date().toLocaleString()}] Bought ${request.name} for ${request.price} coins`);
        sniperHeadShotAudio.play();
        sendResponse({success: true, message: 'successful'})

    }

    /**
     * Handles the 'listed' action which logs the details of the listed player (min/max price) in the logList.
     */
    else if (request.action === 'listed') {
        logList.value.push(`[${new Date().toLocaleString()}] Listed ${request.name} for min ${request.minList} and max ${request.maxList} coins`);

    }

    /**
     * Handles the 'failed' action which increments the 'fails' counter when an attempt to purchase a player fails,
     * logs the failure details in the logList, and plays the 'sniperMissAudio' sound.
     */
    else if (request.action === 'failed') {
        fails.value++;
        logList.value.push(`[${new Date().toLocaleString()}] Failed to buy ${request.name} for ${request.price} coins`);
        sniperMissAudio.play();
        sendResponse({success: true, message: 'successful'})
    }
    else if (request.action === 'futbinTrackedPlayersUpdated') {
        trackedPlayers.value = request.players || [];
        if (request.lastRefresh) {
            lastPriceRefresh.value = request.lastRefresh;
        }
        syncFakebinSelection();
    }
    else if (request.action === 'futbinPriceAlert') {
        const alert = request.alert || {};
        const player = alert.player;
        const change = alert.change;
        if (player && change) {
            const directionText = change.direction === 'increase' ? 'increased' : change.direction === 'decrease' ? 'decreased' : 'changed';
            const platformLabel = player.platform ? player.platform.toUpperCase() : 'PS';
            const timestampText = formatTimestamp(change.timestamp);
            const priceText = `${formatCoins(change.newPrice)} coins`;
            const percentText = Number.isFinite(change.percent) ? `${change.percent > 0 ? '+' : ''}${change.percent.toFixed(2)}%` : '';
            logList.value.push(`[${timestampText}] ${player.name} (${platformLabel}) ${directionText} to ${priceText}${percentText ? ` (${percentText})` : ''}`);
        }
        requestTrackedPlayers();
    }
});


const __returned__ = { running, advancedSettings, playerName, nameList, searchLimit, purchaseLimit, minBuyNow, maxBuyNow, minListPrice, maxListPrice, searchResultDelay, confirmDialogDelay, confirmPurchaseDelay, rpm, autoListChecked, searches, buys, fails, logList, profitRef, sliderKey, pricePlatform, trackedPlayers, lastPriceRefresh, priceTrackerLoading, tabs, activeTab, selectedFakebinKey, PRICE_REFRESH_INTERVAL_MS, coinFormatter, canTrackPrice, formattedLastRefresh, formattedNextRefresh, fakebinPlayers, selectedFakebin, formatTimestamp, formatCoins, formatChange, pushLogEntry, requestTrackedPlayers, sendTrackPlayerMessage, trackFutbinPrice, manualRefreshTrackedPlayers, removeTrackedPlayer, syncFakebinSelection, setActiveTab, toggleFakebin, selectFakebin, applyFakebinToAutobuyer, futbinLink, sniperHeadShotAudio, sniperMissAudio, onPlayerInputChange, onSearchLimitChange, onPurchaseLimitChange, onMinBuyNowChange, onMaxBuyNowChange, onPlayerSelected, onAdvancedSettingsPressed, onCheckedChanged, onMinListPriceChange, onMaxListPriceChange, onClearAllClicked, onSliderValueChange, onSearchResultDelayChange, onConfirmDialogDelayChange, onCheckPurchaseDelayChange, eaAfterTax, startSearch, stopSearch, changeThemeColors, computed, onMounted, ref, watch, CustomInput, CustomButton, CustomSlider, PlayerInput, AutoListCheckBox, SnipingResults, CustomLog, ThemeColorButton }
Object.defineProperty(__returned__, '__isScriptSetup', { enumerable: false, value: true })
return __returned__
}

}



const _hoisted_1 = { class: "popup-wrapper" }
const _hoisted_2 = { class: "popup-container" }
const _hoisted_3 = {
  class: "tab-bar",
  role: "tablist"
}
const _hoisted_4 = ["onClick"]
const _hoisted_5 = { class: "tab-panel tab-panel--autobuyer" }
const _hoisted_6 = { class: "input-container" }
const _hoisted_7 = { class: "custom-button-container" }
const _hoisted_8 = { class: "custom-button-container" }
const _hoisted_9 = {
  key: 0,
  class: "custom-button-container"
}
const _hoisted_10 = {
  key: 1,
  class: "net-label"
}
const _hoisted_11 = { class: "utility-buttons" }
const _hoisted_12 = ["href"]
const _hoisted_13 = {
  key: 0,
  class: "advanced-settings-container"
}
const _hoisted_14 = { class: "advanced" }
const _hoisted_15 = { class: "advanced" }
const _hoisted_16 = { class: "advanced" }
const _hoisted_17 = { class: "theme-color-container" }
const _hoisted_18 = { class: "button-container" }
const _hoisted_19 = {
  key: 0,
  class: "tab-panel tab-panel--scrollable"
}
const _hoisted_20 = { class: "price-tracker-controls" }
const _hoisted_21 = {
  class: "price-tracker-controls__label",
  for: "price-platform-select"
}
const _hoisted_22 = ["disabled"]
const _hoisted_23 = { class: "price-tracker" }
const _hoisted_24 = { class: "price-tracker__header" }
const _hoisted_25 = { class: "price-tracker__meta" }
const _hoisted_26 = {
  key: 0,
  class: "price-tracker__list"
}
const _hoisted_27 = { class: "price-tracker__info" }
const _hoisted_28 = { class: "price-tracker__name" }
const _hoisted_29 = { class: "price-tracker__details" }
const _hoisted_30 = { class: "price-tracker__updated" }
const _hoisted_31 = { class: "price-tracker__pricing" }
const _hoisted_32 = { class: "price-tracker__value" }
const _hoisted_33 = ["disabled", "onClick"]
const _hoisted_34 = {
  key: 1,
  class: "price-tracker__empty"
}
const _hoisted_35 = {
  key: 1,
  class: "tab-panel tab-panel--scrollable"
}
const _hoisted_36 = {
  key: 0,
  class: "fakebin-layout"
}
const _hoisted_37 = { class: "fakebin-watchlist" }
const _hoisted_38 = { class: "fakebin-list" }
const _hoisted_39 = { class: "fakebin-list__summary" }
const _hoisted_40 = { class: "fakebin-list__details" }
const _hoisted_41 = { class: "fakebin-list__name" }
const _hoisted_42 = { class: "fakebin-list__meta" }
const _hoisted_43 = ["disabled", "onClick"]
const _hoisted_44 = { class: "fakebin-list__meta-row" }
const _hoisted_45 = { class: "fakebin-list__price-block" }
const _hoisted_46 = { class: "fakebin-list__value" }
const _hoisted_47 = { class: "fakebin-list__updated" }
const _hoisted_48 = ["disabled", "onClick"]
const _hoisted_49 = {
  key: 0,
  class: "fakebin-selected"
}
const _hoisted_50 = { class: "fakebin-selected__name" }
const _hoisted_51 = { class: "fakebin-selected__meta" }
const _hoisted_52 = { class: "fakebin-selected__price" }
const _hoisted_53 = {
  key: 1,
  class: "fakebin-selected fakebin-selected--empty"
}
const _hoisted_54 = {
  key: 1,
  class: "fakebin-empty"
}

function render(_ctx, _cache) {
  const _component_PlayerInput = _resolveComponent("PlayerInput")
  const _component_CustomInput = _resolveComponent("CustomInput")
  const _component_AutoListCheckBox = _resolveComponent("AutoListCheckBox")
  const _component_CustomButton = _resolveComponent("CustomButton")
  const _component_ThemeColorButton = _resolveComponent("ThemeColorButton")
  const _component_CustomSlider = _resolveComponent("CustomSlider")
  const _component_SnipingResults = _resolveComponent("SnipingResults")
  const _component_CustomLog = _resolveComponent("CustomLog")

  return (_openBlock(), _createElementBlock("div", _hoisted_1, [
    _createElementVNode("div", _hoisted_2, [
      _cache[31] || (_cache[31] = _createElementVNode("h1", { class: "title" }, "PlayerHeadShot", -1 /* HOISTED */)),
      _createElementVNode("nav", _hoisted_3, [
        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.tabs, (tab) => {
          return (_openBlock(), _createElementBlock("button", {
            key: tab.id,
            type: "button",
            class: _normalizeClass(["tab-button", {'tab-button--active': tab.id === _ctx.activeTab}]),
            onClick: $event => (_ctx.setActiveTab(tab.id))
          }, _toDisplayString(tab.label), 11 /* TEXT, CLASS, PROPS */, _hoisted_4))
        }), 128 /* KEYED_FRAGMENT */))
      ]),
      _withDirectives(_createElementVNode("section", _hoisted_5, [
        _createElementVNode("div", _hoisted_6, [
          _createVNode(_component_PlayerInput, {
            "input-id": "player-input",
            label: "Player Name",
            modelValue: _ctx.playerName,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = $event => ((_ctx.playerName) = $event)),
            placeholder: "Search for a player",
            playerList: _ctx.nameList,
            disabled: _ctx.running,
            onInputChangeEvent: _ctx.onPlayerInputChange,
            onSelectedPlayerEvent: _ctx.onPlayerSelected
          }, null, 8 /* PROPS */, ["modelValue", "playerList", "disabled", "onInputChangeEvent", "onSelectedPlayerEvent"]),
          _createElementVNode("div", _hoisted_7, [
            _createVNode(_component_CustomInput, {
              "input-id": "search-limit-input",
              label: "Search Limit",
              modelValue: _ctx.searchLimit,
              "onUpdate:modelValue": _cache[1] || (_cache[1] = $event => ((_ctx.searchLimit) = $event)),
              disabled: _ctx.running,
              max: 15000000,
              min: 0,
              onInputChangeEvent: _ctx.onSearchLimitChange,
              placeholder: "No limit"
            }, null, 8 /* PROPS */, ["modelValue", "disabled", "onInputChangeEvent"]),
            _createVNode(_component_CustomInput, {
              "input-id": "purchase-limit-input",
              label: "Purchase limit",
              modelValue: _ctx.purchaseLimit,
              "onUpdate:modelValue": _cache[2] || (_cache[2] = $event => ((_ctx.purchaseLimit) = $event)),
              disabled: _ctx.running,
              max: 100,
              min: 0,
              onInputChangeEvent: _ctx.onPurchaseLimitChange,
              placeholder: "No limit"
            }, null, 8 /* PROPS */, ["modelValue", "disabled", "onInputChangeEvent"])
          ]),
          _createElementVNode("div", _hoisted_8, [
            _createVNode(_component_CustomInput, {
              id: "min-buy-now-input",
              "input-id": "min-buy-now-input",
              label: "Min Buy Now",
              modelValue: _ctx.minBuyNow,
              "onUpdate:modelValue": _cache[3] || (_cache[3] = $event => ((_ctx.minBuyNow) = $event)),
              disabled: _ctx.running,
              max: 15000000,
              min: 0,
              onInputChangeEvent: _ctx.onMinBuyNowChange,
              placeholder: "Any"
            }, null, 8 /* PROPS */, ["modelValue", "disabled", "onInputChangeEvent"]),
            _createVNode(_component_CustomInput, {
              id: "max-buy-now-input",
              "input-id": "max-buy-now-input",
              label: "Max Buy Now",
              modelValue: _ctx.maxBuyNow,
              "onUpdate:modelValue": _cache[4] || (_cache[4] = $event => ((_ctx.maxBuyNow) = $event)),
              disabled: _ctx.running,
              max: 15000000,
              min: 0,
              onInputChangeEvent: _ctx.onMaxBuyNowChange,
              placeholder: "Any"
            }, null, 8 /* PROPS */, ["modelValue", "disabled", "onInputChangeEvent"])
          ]),
          _createVNode(_component_AutoListCheckBox, {
            onCheckChangedEvent: _ctx.onCheckedChanged,
            checked: _ctx.autoListChecked
          }, null, 8 /* PROPS */, ["onCheckChangedEvent", "checked"]),
          (_ctx.autoListChecked)
            ? (_openBlock(), _createElementBlock("div", _hoisted_9, [
                _createVNode(_component_CustomInput, {
                  "input-id": "min-list-price-input",
                  label: "Min list price",
                  disabled: _ctx.running,
                  modelValue: _ctx.minListPrice,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = $event => ((_ctx.minListPrice) = $event)),
                  onInputChangeEvent: _ctx.onMinListPriceChange,
                  max: 15000000,
                  min: 0,
                  placeholder: "Min list price"
                }, null, 8 /* PROPS */, ["disabled", "modelValue", "onInputChangeEvent"]),
                _createVNode(_component_CustomInput, {
                  "input-id": "max-list-price-input",
                  label: "Max list price",
                  disabled: _ctx.running,
                  modelValue: _ctx.maxListPrice,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = $event => ((_ctx.maxListPrice) = $event)),
                  onInputChangeEvent: _ctx.onMaxListPriceChange,
                  max: 15000000,
                  min: 0,
                  placeholder: "Max list price"
                }, null, 8 /* PROPS */, ["disabled", "modelValue", "onInputChangeEvent"])
              ]))
            : _createCommentVNode("v-if", true),
          (_ctx.autoListChecked && _ctx.maxBuyNow && _ctx.maxListPrice)
            ? (_openBlock(), _createElementBlock("label", _hoisted_10, [
                _cache[12] || (_cache[12] = _createTextVNode(" Profit: ")),
                _createElementVNode("p", {
                  ref: "profitRef",
                  class: "profit-p"
                }, _toDisplayString(_ctx.eaAfterTax(_ctx.maxBuyNow, _ctx.maxListPrice)), 513 /* TEXT, NEED_PATCH */)
              ]))
            : _createCommentVNode("v-if", true),
          _createElementVNode("div", _hoisted_11, [
            _createVNode(_component_CustomButton, {
              "button-id": "clear-all",
              class: "clear-all-button",
              text: "Clear All",
              disabled: _ctx.running,
              onClick: _ctx.onClearAllClicked
            }, null, 8 /* PROPS */, ["disabled", "onClick"]),
            _createElementVNode("a", {
              href: _ctx.futbinLink,
              target: "_blank",
              rel: "noopener noreferrer",
              class: _normalizeClass(["futbin-link", {'futbin-link--disabled': !_ctx.playerName || !_ctx.playerName.trim()}])
            }, " Futbin ", 10 /* CLASS, PROPS */, _hoisted_12)
          ])
        ]),
        _createElementVNode("label", {
          onClick: _cache[7] || (_cache[7] = (...args) => (_ctx.onAdvancedSettingsPressed && _ctx.onAdvancedSettingsPressed(...args))),
          class: "advanced-settings-label"
        }, _toDisplayString("Advanced settings \u2699")),
        (_ctx.advancedSettings)
          ? (_openBlock(), _createElementBlock("div", _hoisted_13, [
              _cache[16] || (_cache[16] = _createElementVNode("h2", null, "Delay", -1 /* HOISTED */)),
              _cache[17] || (_cache[17] = _createElementVNode("hr", null, null, -1 /* HOISTED */)),
              _cache[18] || (_cache[18] = _createElementVNode("div", { class: "advanced-label-container" }, [
                _createElementVNode("label", { class: "advanced-label description" }, "If you are experiencing that the bot fails to purchase sometimes, or gets stuck, try to increase these delay metrics: ")
              ], -1 /* HOISTED */)),
              _createElementVNode("div", _hoisted_14, [
                _createVNode(_component_CustomInput, {
                  "input-id": "wait-search-results-input",
                  disabled: !_ctx.advancedSettings,
                  modelValue: _ctx.searchResultDelay,
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = $event => ((_ctx.searchResultDelay) = $event)),
                  onInputChangeEvent: _ctx.onSearchResultDelayChange,
                  max: 1000,
                  min: 0,
                  placeholder: "Default 250 ms"
                }, null, 8 /* PROPS */, ["disabled", "modelValue", "onInputChangeEvent"]),
                _cache[13] || (_cache[13] = _createElementVNode("label", { class: "advanced-label" }, "Delay time for search results (milliseconds)", -1 /* HOISTED */))
              ]),
              _createElementVNode("div", _hoisted_15, [
                _createVNode(_component_CustomInput, {
                  "input-id": "wait-confirm-dialog-input",
                  disabled: !_ctx.advancedSettings,
                  modelValue: _ctx.confirmDialogDelay,
                  "onUpdate:modelValue": _cache[9] || (_cache[9] = $event => ((_ctx.confirmDialogDelay) = $event)),
                  onInputChangeEvent: _ctx.onConfirmDialogDelayChange,
                  max: 1000,
                  min: 0,
                  placeholder: "Default 80 ms"
                }, null, 8 /* PROPS */, ["disabled", "modelValue", "onInputChangeEvent"]),
                _cache[14] || (_cache[14] = _createElementVNode("label", { class: "advanced-label" }, "Delay time for confirm dialog (milliseconds)", -1 /* HOISTED */))
              ]),
              _createElementVNode("div", _hoisted_16, [
                _createVNode(_component_CustomInput, {
                  "input-id": "wait-confirm-purchase-input",
                  disabled: !_ctx.advancedSettings,
                  modelValue: _ctx.confirmPurchaseDelay,
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = $event => ((_ctx.confirmPurchaseDelay) = $event)),
                  onInputChangeEvent: _ctx.onCheckPurchaseDelayChange,
                  max: 1000,
                  min: 0,
                  placeholder: "Default 800 ms"
                }, null, 8 /* PROPS */, ["disabled", "modelValue", "onInputChangeEvent"]),
                _cache[15] || (_cache[15] = _createElementVNode("label", { class: "advanced-label" }, "Delay time for purchase confirmation (milliseconds)", -1 /* HOISTED */))
              ]),
              _cache[19] || (_cache[19] = _createElementVNode("h2", null, "Theme Color", -1 /* HOISTED */)),
              _cache[20] || (_cache[20] = _createElementVNode("hr", null, null, -1 /* HOISTED */)),
              _createElementVNode("div", _hoisted_17, [
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#3091ae",
                  "secondary-color": "#5b51ae",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#EF4765",
                  "secondary-color": "#FF9A5A",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#3bff72",
                  "secondary-color": "#81eee0",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#1628e5",
                  "secondary-color": "#30ffe2",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#e875d1",
                  "secondary-color": "#004aff",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#f82b2b",
                  "secondary-color": "#d338f6",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#ffc01e",
                  "secondary-color": "#f59393",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#8f3bcb",
                  "secondary-color": "#42d73e",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#e00f3e",
                  "secondary-color": "#efeb3a",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#1abc9c",
                  "secondary-color": "#16a085",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#ff7f50",
                  "secondary-color": "#ff4500",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"]),
                _createVNode(_component_ThemeColorButton, {
                  "primary-color": "#6a5acd",
                  "secondary-color": "#20b2aa",
                  onThemeColorChange: _ctx.changeThemeColors
                }, null, 8 /* PROPS */, ["onThemeColorChange"])
              ])
            ]))
          : _createCommentVNode("v-if", true),
        (_openBlock(), _createBlock(_component_CustomSlider, {
          key: _ctx.sliderKey,
          onSliderValueChange: _ctx.onSliderValueChange,
          rpm: _ctx.rpm
        }, null, 8 /* PROPS */, ["onSliderValueChange", "rpm"])),
        _createElementVNode("div", _hoisted_18, [
          _createVNode(_component_CustomButton, {
            "button-id": "stop-button",
            text: "Stop",
            onClick: _ctx.stopSearch,
            disabled: !_ctx.running
          }, null, 8 /* PROPS */, ["onClick", "disabled"]),
          _createVNode(_component_CustomButton, {
            "button-id": "Search-button",
            text: "Search",
            onClick: _ctx.startSearch,
            disabled: _ctx.running
          }, null, 8 /* PROPS */, ["onClick", "disabled"])
        ]),
        _createVNode(_component_SnipingResults, {
          fails: _ctx.fails,
          buys: _ctx.buys,
          searches: _ctx.searches
        }, null, 8 /* PROPS */, ["fails", "buys", "searches"]),
        _createVNode(_component_CustomLog, { logList: _ctx.logList }, null, 8 /* PROPS */, ["logList"]),
        _cache[21] || (_cache[21] = _createElementVNode("label", { class: "credit-label" }, [
          _createTextVNode("Made by: "),
          _createElementVNode("a", {
            href: "https://github.com/jenscaa",
            target: "_blank"
          }, "jenscaa")
        ], -1 /* HOISTED */))
      ], 512 /* NEED_PATCH */), [
        [_vShow, _ctx.activeTab === 'autobuyer']
      ]),
      (_ctx.activeTab === 'watchlist')
        ? (_openBlock(), _createElementBlock("section", _hoisted_19, [
            _createElementVNode("div", _hoisted_20, [
              _createElementVNode("label", _hoisted_21, [
                _cache[23] || (_cache[23] = _createTextVNode(" Platform ")),
                _withDirectives(_createElementVNode("select", {
                  id: "price-platform-select",
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = $event => ((_ctx.pricePlatform) = $event)),
                  disabled: _ctx.priceTrackerLoading,
                  class: "price-tracker-controls__select"
                }, _cache[22] || (_cache[22] = [
                  _createElementVNode("option", { value: "ps" }, "PlayStation", -1 /* HOISTED */),
                  _createElementVNode("option", { value: "pc" }, "PC", -1 /* HOISTED */),
                  _createElementVNode("option", { value: "xbox" }, "Xbox", -1 /* HOISTED */)
                ]), 8 /* PROPS */, _hoisted_22), [
                  [_vModelSelect, _ctx.pricePlatform]
                ])
              ]),
              _createVNode(_component_CustomButton, {
                "button-id": "track-player",
                text: "Track Futbin Price",
                disabled: !_ctx.canTrackPrice || _ctx.priceTrackerLoading,
                onClick: _ctx.trackFutbinPrice
              }, null, 8 /* PROPS */, ["disabled", "onClick"]),
              _createVNode(_component_CustomButton, {
                "button-id": "refresh-prices",
                text: "Refresh Watchlist",
                disabled: _ctx.priceTrackerLoading,
                onClick: _ctx.manualRefreshTrackedPlayers
              }, null, 8 /* PROPS */, ["disabled", "onClick"])
            ]),
            _createElementVNode("div", _hoisted_23, [
              _createElementVNode("div", _hoisted_24, [
                _cache[24] || (_cache[24] = _createElementVNode("h2", null, "Futbin Watchlist", -1 /* HOISTED */)),
                _createElementVNode("p", _hoisted_25, "Last refresh: " + _toDisplayString(_ctx.formattedLastRefresh) + " · Next: " + _toDisplayString(_ctx.formattedNextRefresh), 1 /* TEXT */)
              ]),
              (_ctx.trackedPlayers.length)
                ? (_openBlock(), _createElementBlock("ul", _hoisted_26, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.trackedPlayers, (player) => {
                      return (_openBlock(), _createElementBlock("li", {
                        key: player.storageKey,
                        class: "price-tracker__item"
                      }, [
                        _createElementVNode("div", _hoisted_27, [
                          _createElementVNode("span", _hoisted_28, _toDisplayString(player.name), 1 /* TEXT */),
                          _createElementVNode("span", _hoisted_29, [
                            _createTextVNode(_toDisplayString((player.platform || 'ps').toUpperCase()) + " ", 1 /* TEXT */),
                            (player.rating)
                              ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                  _createTextVNode(" · " + _toDisplayString(player.rating) + " OVR", 1 /* TEXT */)
                                ], 64 /* STABLE_FRAGMENT */))
                              : _createCommentVNode("v-if", true),
                            (player.revision)
                              ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                  _createTextVNode(" · " + _toDisplayString(player.revision), 1 /* TEXT */)
                                ], 64 /* STABLE_FRAGMENT */))
                              : _createCommentVNode("v-if", true)
                          ]),
                          _createElementVNode("span", _hoisted_30, "Updated " + _toDisplayString(_ctx.formatTimestamp(player.lastUpdated)), 1 /* TEXT */)
                        ]),
                        _createElementVNode("div", _hoisted_31, [
                          _createElementVNode("span", _hoisted_32, _toDisplayString(_ctx.formatCoins(player.lastPrice)) + " coins", 1 /* TEXT */),
                          _createElementVNode("span", {
                            class: _normalizeClass(["price-tracker__change", {
                                              'price-tracker__change--positive': player.lastChange?.direction === 'increase',
                                              'price-tracker__change--negative': player.lastChange?.direction === 'decrease'
                                          }])
                          }, _toDisplayString(_ctx.formatChange(player.lastChange)), 3 /* TEXT, CLASS */)
                        ]),
                        _createElementVNode("button", {
                          class: "price-tracker__remove",
                          disabled: _ctx.priceTrackerLoading,
                          onClick: $event => (_ctx.removeTrackedPlayer(player))
                        }, " Remove ", 8 /* PROPS */, _hoisted_33)
                      ]))
                    }), 128 /* KEYED_FRAGMENT */))
                  ]))
                : (_openBlock(), _createElementBlock("p", _hoisted_34, "Track a player to monitor price swings every five minutes."))
            ])
          ]))
        : _createCommentVNode("v-if", true),
      (_ctx.activeTab === 'fakebins')
        ? (_openBlock(), _createElementBlock("section", _hoisted_35, [
            _cache[30] || (_cache[30] = _createElementVNode("div", { class: "fakebin-intro" }, [
              _createElementVNode("p", null, "Use live Futbin prices as fakebins for quick autobuyer setup. Toggle any tracked player and drop their price into your buy and list fields instantly.")
            ], -1 /* HOISTED */)),
            (_ctx.trackedPlayers.length)
              ? (_openBlock(), _createElementBlock("div", _hoisted_36, [
                  _createElementVNode("div", _hoisted_37, [
                    _cache[26] || (_cache[26] = _createElementVNode("h2", null, "Fakebin Watchlist", -1 /* HOISTED */)),
                    _cache[27] || (_cache[27] = _createElementVNode("p", { class: "fakebin-watchlist__hint" }, "Mark tracked players as fakebins to reuse their Futbin price in the autobuyer.", -1 /* HOISTED */)),
                    _createElementVNode("ul", _hoisted_38, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(_ctx.trackedPlayers, (player) => {
                        return (_openBlock(), _createElementBlock("li", {
                          key: player.storageKey,
                          class: "fakebin-list__item"
                        }, [
                          _createElementVNode("div", _hoisted_39, [
                            _createElementVNode("div", _hoisted_40, [
                              _createElementVNode("span", _hoisted_41, _toDisplayString(player.name), 1 /* TEXT */),
                              _createElementVNode("span", _hoisted_42, [
                                _createTextVNode(_toDisplayString((player.platform || 'ps').toUpperCase()) + " ", 1 /* TEXT */),
                                (player.rating)
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                      _createTextVNode(" · " + _toDisplayString(player.rating) + " OVR", 1 /* TEXT */)
                                    ], 64 /* STABLE_FRAGMENT */))
                                  : _createCommentVNode("v-if", true),
                                (player.revision)
                                  ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                      _createTextVNode(" · " + _toDisplayString(player.revision), 1 /* TEXT */)
                                    ], 64 /* STABLE_FRAGMENT */))
                                  : _createCommentVNode("v-if", true)
                              ])
                            ]),
                            _createElementVNode("button", {
                              type: "button",
                              class: _normalizeClass(["fakebin-toggle", {'fakebin-toggle--active': player.fakebin?.active}]),
                              disabled: _ctx.priceTrackerLoading,
                              onClick: $event => (_ctx.toggleFakebin(player))
                            }, _toDisplayString(player.fakebin?.active ? 'Fakebin active' : 'Mark Fakebin'), 11 /* TEXT, CLASS, PROPS */, _hoisted_43)
                          ]),
                          _createElementVNode("div", _hoisted_44, [
                            _createElementVNode("div", _hoisted_45, [
                              _cache[25] || (_cache[25] = _createElementVNode("span", { class: "fakebin-list__label" }, "Futbin price", -1 /* HOISTED */)),
                              _createElementVNode("span", _hoisted_46, _toDisplayString(_ctx.formatCoins(player.fakebin?.lastAppliedPrice || player.lastPrice)) + " coins", 1 /* TEXT */),
                              _createElementVNode("span", _hoisted_47, "Updated " + _toDisplayString(_ctx.formatTimestamp(player.fakebin?.updated || player.lastUpdated)), 1 /* TEXT */)
                            ]),
                            _createElementVNode("button", {
                              type: "button",
                              class: _normalizeClass(["fakebin-select", {'fakebin-select--active': _ctx.selectedFakebin && _ctx.selectedFakebin.storageKey === player.storageKey}]),
                              disabled: !player.fakebin?.active,
                              onClick: $event => (_ctx.selectFakebin(player))
                            }, _toDisplayString(_ctx.selectedFakebin && _ctx.selectedFakebin.storageKey === player.storageKey ? 'Selected' : 'Select'), 11 /* TEXT, CLASS, PROPS */, _hoisted_48)
                          ])
                        ]))
                      }), 128 /* KEYED_FRAGMENT */))
                    ])
                  ]),
                  (_ctx.selectedFakebin)
                    ? (_openBlock(), _createElementBlock("div", _hoisted_49, [
                        _cache[28] || (_cache[28] = _createElementVNode("h2", null, "Selected Fakebin", -1 /* HOISTED */)),
                        _createElementVNode("p", _hoisted_50, _toDisplayString(_ctx.selectedFakebin.name), 1 /* TEXT */),
                        _createElementVNode("p", _hoisted_51, [
                          _createTextVNode(_toDisplayString((_ctx.selectedFakebin.platform || 'ps').toUpperCase()) + " ", 1 /* TEXT */),
                          (_ctx.selectedFakebin.rating)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                                _createTextVNode(" · " + _toDisplayString(_ctx.selectedFakebin.rating) + " OVR", 1 /* TEXT */)
                              ], 64 /* STABLE_FRAGMENT */))
                            : _createCommentVNode("v-if", true),
                          (_ctx.selectedFakebin.revision)
                            ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
                                _createTextVNode(" · " + _toDisplayString(_ctx.selectedFakebin.revision), 1 /* TEXT */)
                              ], 64 /* STABLE_FRAGMENT */))
                            : _createCommentVNode("v-if", true)
                        ]),
                        _createElementVNode("p", _hoisted_52, " Futbin price · " + _toDisplayString(_ctx.formatCoins(_ctx.selectedFakebin.fakebin?.lastAppliedPrice || _ctx.selectedFakebin.lastPrice)) + " coins ", 1 /* TEXT */),
                        _createVNode(_component_CustomButton, {
                          "button-id": "apply-fakebin",
                          class: "fakebin-selected__apply",
                          text: "Use in Autobuyer",
                          disabled: _ctx.priceTrackerLoading,
                          onClick: _ctx.applyFakebinToAutobuyer
                        }, null, 8 /* PROPS */, ["disabled", "onClick"])
                      ]))
                    : (_openBlock(), _createElementBlock("div", _hoisted_53, _cache[29] || (_cache[29] = [
                        _createElementVNode("p", null, "Select a fakebin to load its price into the autobuyer.", -1 /* HOISTED */)
                      ])))
                ]))
              : (_openBlock(), _createElementBlock("p", _hoisted_54, "Track a Futbin player first to create fakebins you can reuse here."))
          ]))
        : _createCommentVNode("v-if", true)
    ])
  ]))
}
__sfc__.render = render;
__sfc__.__scopeId = 'data-v-0d1c0cf702348b0f824eb70579d8ba63';
__sfc__.components = Object.assign({}, __sfc__.components, { 'AutoListCheckBox': AutoListCheckBox, 'CustomButton': CustomButton, 'CustomInput': CustomInput, 'CustomLog': CustomLog, 'CustomSlider': CustomSlider, 'PlayerInput': PlayerInput, 'SnipingResults': SnipingResults, 'ThemeColorButton': ThemeColorButton });
module.exports.default = __sfc__;

});

const { createApp } = window.Vue;
const app = createApp(__require('@/Popup.vue').default);
app.mount('#app');
})();
