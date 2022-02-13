// https://alligator.io/web-components/attributes-properties/
const svgNS = "http://www.w3.org/2000/svg";
const svgTmpl = document.createElement('template');
svgTmpl.innerHTML = `
<svg version="1.1" baseprofile="full" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
xmlns:ev="http://www.w3.org/2001/xml-events" width="600" height="50" viewBox="0 0 600 50">
<defs>
<style>
</style>
</defs>
<g>
    <g class="ruler" data-slider-value="0">
    </g>
    <g class="ruler-labels">
    </g>
    <g class="feedback">
    </g>
</g>
</svg>
`;

const styleTmpl = `
text {
    font-family: 'Inter', sans-serif;
}
.ruler path {
    stroke: {{color}};
    stroke-width: 3;
}
.ruler-labels text {
    fill: {{color}};
    font-size: 18px;
}
.feedback text {
    font-size: 26px;
    font-style: italic;
    display: none;
}
.ruler circle {
    fill: #FFF;
    stroke: {{color}};
    stroke-width: 3;
}
.ruler circle:hover {
    fill: {{select-color}};
    cursor: pointer;
}
circle.selected {
    fill: {{select-color}};
}
rect {
    fill: #000;
}
`;

class BlueSlider extends HTMLElement {

    constructor() {
        super();

        const shadowRoot = this.attachShadow({mode: 'open'});
        shadowRoot.appendChild(svgTmpl.content.cloneNode(true));

        this.svgRoot = shadowRoot.querySelector('svg');
        this.svgStyle = shadowRoot.querySelector('style');
        this.rulerGroup = shadowRoot.querySelector('.ruler');
        this.labelGroup = shadowRoot.querySelector('.ruler-labels');
        this.feedbackGroup = shadowRoot.querySelector('.feedback');
    }

    connectedCallback() {
        // ticks (precondition: 0 < ticks <= 11)
        if (this.hasAttribute('ticks')) {
            this.setAttribute('ticks', (this.getAttribute('ticks') < 1 || this.getAttribute('ticks') > 11) ? 6 : this.getAttribute('ticks'));
        } else {
            this.setAttribute('ticks', 6);
        }
        // min (precondition: -5 <= min <= 5)
        if (this.hasAttribute('min')) {
            this.setAttribute('min', (this.getAttribute('min') < -5 || this.getAttribute('min') > 5) ? 0 : this.getAttribute('min'));
        } else {
            this.setAttribute('min', 0);
        }
        // color (default: black)
        if (!this.hasAttribute('color')) {
            this.setAttribute('color', '#000000');
        }
        // select-color (default: blue)
        if (!this.hasAttribute('select-color')) {
            this.setAttribute('select-color', '#6fa5eb');
        }
        // value
        this.setAttribute('value', this.getAttribute('min') > 0 ? this.getAttribute('min') : 0);
        
        this.render(parseInt(this.getAttribute('ticks')), parseInt(this.getAttribute('min')), 
                    this.getAttribute('color'), this.getAttribute('select-color'));
    }
    
    render(ticks, min, color, selectColor) {
        // add style content
        this.svgStyle.textContent = styleTmpl.replace(/{{color}}/g, color).replace(/{{select-color}}/g, selectColor);
        // svg view box
        const interval = this.getInterval(ticks);
        const length = interval * (ticks - 1);
        const width = length + 100;
        this.svgRoot.setAttribute('width', width);
        this.svgRoot.setAttribute('viewBox', "0 0 " + width + " 50");

        // ruler with ticks
        const path = document.createElementNS(svgNS, 'path');
        path.setAttribute('d', "M 10 15 l " + length +" 0");
        this.rulerGroup.appendChild(path);
        for (var i=0; i<ticks; i++) {
            this.rulerGroup.appendChild(this.createTick(i, interval, min));
        }
        
        // labels
        for (var i=0; i<ticks; i++) {
            this.labelGroup.appendChild(this.createLabel(i, interval, min));
        }

        // feedback
        this.feedbackGroup.appendChild(this.createFeedback(length));
    }

    getInterval(ticks) {
        return ticks < 6 ? (240 - 20*ticks) : (160 - 10*ticks);
    }
    
    createTick(tick, interval, min) {
        const circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', 15 + tick * interval);
        circle.setAttribute('cy', "15");
        circle.setAttribute('r', "13"); // 10
        circle.setAttribute('data-value', min + tick);
        circle.addEventListener('click', e => {
            this.handleValue(e.target);
        });
        return circle;
    }

    createLabel(tick, interval, min) {
        const label = document.createElementNS(svgNS, 'text');
        const lblValue = min + tick;
        const offset = (lblValue < 0 || lblValue >= 10) ? 5 : 10;
        label.setAttribute('x', offset + tick * interval);
        label.setAttribute('y', "49"); // 45
        label.innerHTML = lblValue;
        return label;
    }
    
    createFeedback(length) {
        const feedback = document.createElementNS(svgNS, 'text');
        feedback.setAttribute('x', length + 75);
        feedback.setAttribute('y', "25");
        feedback.innerHTML = 0;
        return feedback;
    }

    handleValue(circle) {
        const parent = circle.parentNode;
        this.deselect(parent);
        this.setAttribute('value', circle.dataset.value);
        circle.classList.add("selected");
        const feedbackEl = parent.parentNode.getElementsByClassName("feedback")[0].getElementsByTagName("text")[0];
        feedbackEl.textContent = circle.dataset.value;
        feedbackEl.style.display = "inline";         
    }

    deselect(parent) {
        const circles = [...parent.getElementsByTagName("circle")]
        circles.forEach(c => c.classList.remove("selected"));
    }

    set ticks(newValue) {
        this.setAttribute('ticks', newValue);
    }

    set min(newValue) {
        this.setAttribute('min', newValue);
    }

    set color(newValue) {
        this.setAttribute('color', newValue);
    }

    set selectColor(newValue) {
        this.setAttribute('select-color', newValue);
    }

    set value(newValue) {
        this.setAttribute('value', newValue);
    }

}

customElements.define("blue-slider", BlueSlider);