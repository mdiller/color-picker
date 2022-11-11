<template>
	<DillermNavBar :config="config" />
	<canvas @click="imageClicked" width="0" height="0" ref="canvas">
	</canvas>
	<div id="content" class="dillerm dillerm-content">
		<input
			type="file"
			@change="uploadFile"
			ref="file">
		<div id="color-preview">
			<div>
				{{ color.hex }}
			</div>
		</div>
		<gradient-slider
			v-model:value="color.r"
			color_template="rgba({value}, var(--color-g), var(--color-b), var(--slider-opacity))"
			:min="0" :max="255"
		/>
		<gradient-slider
			v-model:value="color.g"
			color_template="rgba(var(--color-r), {value}, var(--color-b), var(--slider-opacity))"
			:min="0" :max="255"
		/>
		<gradient-slider
			v-model:value="color.b"
			color_template="rgba(var(--color-r), var(--color-g), {value}, var(--slider-opacity))"
			:min="0" :max="255"
		/>
		<br/>
		<gradient-slider
			v-model:value="color.h"
			color_template="hsla({value}, var(--color-s), var(--color-l), var(--slider-opacity))"
			:color_nodes="7"
			:min="0" :max="356"
		/>
		<gradient-slider
			v-model:value="color.s"
			color_template="hsla(var(--color-h), {value}%, var(--color-l), var(--slider-opacity))"
			:is_percent="true"
			:min="0" :max="100"
		/>
		<gradient-slider
			v-model:value="color.l"
			color_template="hsla(var(--color-h), var(--color-s), {value}%, var(--slider-opacity))"
			:color_nodes="3"
			:is_percent="true"
			:min="0" :max="100"
		/>
		<color-cube
			:h="color.h"
			:s="color.s"
			:l="color.l" />
	</div>
</template>

<script>
import DillermNumerical from "@dillerm/webutils/src/components/controls/DillermNumerical.vue";
import DillermNavBar from "@dillerm/webutils/src/components/DillermNavBar.vue";
import { rgbToHex, rgbToHsl, hslToRgb, hexToRgb } from "@dillerm/webutils/src/utils.js";

var image_selector = document.getElementById("image-selector")

import GradientSlider from "./components/GradientSlider.vue";
import ColorCube from "./components/ColorCube.vue";
var COLOR_PROP_MAP = {
	r: "--color-r",
	g: "--color-g",
	b: "--color-b",
	h: "--color-h",
	s: "--color-s",
	l: "--color-l",
	hex: "--color-hex"
}

export default {
	components: {
		DillermNumerical,
		DillermNavBar,
		GradientSlider,
		ColorCube
	},
	data() {
		return {
			config: {
				title: "Color Editor",
				github_url: "https://github.com/mdiller/color-editor"
			},
			color: {
				r: 0,
				g: 75,
				b: 125,
				h: 0,
				s: 0,
				l: 0,
				hex: ""
			},
			shown_color: {},
			slider_val: 55,
			handling_change: false,
			image: null
		}
	},
	methods: {
		updateColorProps(force_update = false) {
			Object.keys(COLOR_PROP_MAP).forEach(prop => {
				if (force_update || (this.shown_color[prop] != this.color[prop])) {
					if (this.$el && this.$el.parentElement) { // the immediate calls this before mounting, so 
						var color = this.color[prop]
						this.shown_color[prop] = color;
						if ((typeof color) == "number") {
							color = color.toFixed();
						}
						if (prop == "l") {
							this.$el.parentElement.style.setProperty("--color-l-decimal", `${(color / 100).toFixed(2)}`);
						}
						if (["s", "l"].includes(prop)) {
							color = `${color}%`;
						}
						// console.log("setting", COLOR_PROP_MAP[prop], color)
						this.$el.parentElement.style.setProperty(COLOR_PROP_MAP[prop], color);
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
			if (changed_keys.length > 0) {
				if (changed_keys.filter(key => [ "r", "g", "b" ].includes(key)).length > 0) {
					Object.assign(this.color, rgbToHsl(this.color));
				}
				else {
					Object.assign(this.color, hslToRgb(this.color));
				}
				this.color.hex = rgbToHex({
					r: Math.round(this.color.r),
					g: Math.round(this.color.g),
					b: Math.round(this.color.b)
				});
			}
		},
		setColorHex(color) {
			Object.assign(this.color, hexToRgb(color));
		},
		uploadFile() {
			var file = this.$refs.file.files[0];
			if (!file) {
				return;
			}
			this.setColorHex("#00ff00")
			
			const reader = new FileReader();
			reader.readAsDataURL(file);
			var canvas = this.$refs.canvas;
			reader.addEventListener("load", function() {
				var img = new Image();
				img.onload = () => {
					var width = img.naturalWidth;
					var height = img.naturalHeight;
					canvas.width = width;
					canvas.height = height;
					canvas.getContext("2d").drawImage(img, 0, 0, width, height);
				}
				img.src = this.result;
			})
		},
		imageClicked(event) {
			var canvas = this.$refs.canvas;
			var canvasBounds = canvas.getBoundingClientRect();
			var x = event.clientX - canvasBounds.left;
			var y = event.clientY - canvasBounds.top;
			var data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;

			// set color via rgb
			Object.assign(this.color, {
				r: data[0],
				g: data[1],
				b: data[2]
			});
			console.log(rgbToHex({
				r: data[0],
				g: data[1],
				b: data[2]
			}));
		}
	},
	watch: {
		color: {
			handler() {
				if (this.handling_change) {
					console.log("skipping")
					return;
				}
				this.handling_change = true;
				this.reCalculateColors();
				this.updateColorProps();
				this.handling_change = false;
			},
			deep: true
		}
	},
	mounted() {
		this.handling_change = true;
		this.reCalculateColors();
		this.updateColorProps(true);
		this.handling_change = false;
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

canvas {
	margin: auto;
	display: block;
}

input[type="file"] {
	cursor: pointer;
	width: 100%;
	background-color: var(--input-background);
	border: var(--input-border);
	border-radius: var(--input-border-radius);
	line-height: calc(var(--input-height) - 2 * var(--input-border-size));
	padding: 0px 8px;
}
input[type="file"]::file-selector-button {
	border: var(--input-border);
	border-radius: var(--input-border-radius);
	color: var(--input-color);
	background-color: var(--background-color1);
	padding: 5px;
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