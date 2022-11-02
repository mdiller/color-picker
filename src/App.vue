<template>
	<DillermNavBar :config="config" />
	<div id="content" class="dillerm dillerm-content">
		<div id="color-preview">
			<div>
				{{ color.hex }}
			</div>
		</div>
		<gradient-slider
			v-model:value="color.r"
			color1="rgba(0, var(--color-g), var(--color-b), var(--slider-opacity))"
			color2="rgba(255, var(--color-g), var(--color-b), var(--slider-opacity))"
			:min="0"
			:max="255"
		/>
		<gradient-slider
			v-model:value="color.g"
			color1="rgba(var(--color-r), 0, var(--color-b), var(--slider-opacity))"
			color2="rgba(var(--color-r), 255, var(--color-b), var(--slider-opacity))"
			:min="0"
			:max="255"
		/>
		<gradient-slider
			v-model:value="color.b"
			color1="rgba(var(--color-r), var(--color-g), 0, var(--slider-opacity))"
			color2="rgba(var(--color-r), var(--color-g), 255, var(--slider-opacity))"
			:min="0"
			:max="255"
		/>
	</div>
</template>

<script>
import DillermNavBar from "@dillerm/webutils/src/components/DillermNavBar.vue"
import { rgbToHex } from "@dillerm/webutils/src/utils.js"

import GradientSlider from "./components/GradientSlider.vue";
var COLOR_PROP_MAP = {
	r: "--color-r",
	g: "--color-g",
	b: "--color-b",
	hex: "--color-hex"
}

export default {
	components: {
		DillermNavBar,
		GradientSlider
	},
	data() {
		return {
			config: {
				title: "Color Editor",
				github_url: "https://github.com/mdiller/color-editor"
			},
			color: {
				r: 55,
				g: 44,
				b: 22,
				hex: ""
			},
			shown_color: {},
			slider_val: 55,
			handling_change: false
		}
	},
	methods: {
		updateColorProps(force_update = false) {
			Object.keys(COLOR_PROP_MAP).forEach(prop => {
				if (force_update || (this.shown_color[prop] != this.color[prop])) {
					if (this.$el && this.$el.parentElement) { // the immediate calls this before mounting, so 
						this.shown_color[prop] = this.color[prop];
						this.$el.parentElement.style.setProperty(COLOR_PROP_MAP[prop], this.color[prop]);
					}
				}
			});
		},
		reCalculateColors() {
			var changed_keys = [];
			if (Object.keys(this.shown_color).length == 0) {
				Object.keys(COLOR_PROP_MAP).forEach(prop => this.shown_color[prop] = this.color[prop]);
				changed_keys = Object.keys(COLOR_PROP_MAP);
			}
			else {
				changed_keys = Object.keys(COLOR_PROP_MAP).filter(prop => this.color[prop] != this.shown_color[prop])
			}
			
			this.color.hex = rgbToHex(this.color);
		}
	},
	watch: {
		color: {
			handler() {
				if (this.handling_change) {
					return;
				}
				this.handling_change = true;
				this.reCalculateColors();
				this.updateColorProps();
				this.handling_change = false;
			},
			deep: true,
			immediate: true
		}
	},
	mounted() {
		this.updateColorProps(true);
	}
};


</script>

<style>

:root {
	--slider-opacity: 75%;
}

#content {
	max-width: 400px;
}


#color-preview {
	position: relative;
	border-radius: 4px;
	background: rgb(var(--color-r), var(--color-g), var(--color-b));
	width: 100%;
	height: 100px;
	border: 2px solid var(--background-color3);
	margin-bottom: 10px;
}

#color-preview > div {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	padding: 8px;
	color: white;
	background: black;
	opacity: 50%;
}

</style>