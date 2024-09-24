<template>
	<DillermNavBar :config="config" />
	<div id="container" class="dillerm">
		<div>
			<color-cube
				:h="color.h"
				:s="color.s"
				:l="color.l" />
			<input
				type="file"
				@change="uploadFile"
				ref="file"
				accept=".png,.jpg,.jpeg">
			<div id="pastedWrapper" :style="{ display: image != null ? 'block': 'none' }">
				<canvas @click="imageClicked" @wheel="zoomCanvas" width="0" height="0" ref="canvas">
				</canvas>
			</div>
		</div>
		<div>
			<div id="color-preview">
				<div>
					{{ color.hex }}
				</div>
			</div>
			<div class="combo-table">
				<div>{{ rgb_text }}</div>
				<span>R</span>
				<gradient-slider
					v-model:value="color.r"
					color_template="rgba({value}, var(--color-g), var(--color-b), var(--slider-opacity))"
					:min="0" :max="255"
				/>
				<span>G</span>
				<gradient-slider
					v-model:value="color.g"
					color_template="rgba(var(--color-r), {value}, var(--color-b), var(--slider-opacity))"
					:min="0" :max="255"
				/>
				<span>B</span>
				<gradient-slider
					v-model:value="color.b"
					color_template="rgba(var(--color-r), var(--color-g), {value}, var(--slider-opacity))"
					:min="0" :max="255"
				/>
			</div>
			<br/>
			<div class="combo-table">
				<div>{{ hsl_text }}</div>
				<span>H</span>
				<gradient-slider
					v-model:value="color.h"
					color_template="hsla({value}, var(--color-s), var(--color-l), var(--slider-opacity))"
					:color_nodes="7"
					:min="0" :max="356"
				/>
				<span>S</span>
				<gradient-slider
					v-model:value="color.s"
					color_template="hsla(var(--color-h), {value}%, var(--color-l), var(--slider-opacity))"
					:is_percent="true"
					:min="0" :max="100"
				/>
				<span>L</span>
				<gradient-slider
					v-model:value="color.l"
					color_template="hsla(var(--color-h), var(--color-s), {value}%, var(--slider-opacity))"
					:color_nodes="3"
					:is_percent="true"
					:min="0" :max="100"
				/>
			</div>
		</div>
		<div>
			<h3>Similar Colors</h3>
			<div
				v-for="similar_color in similar_colors"
				class="color-panel"
				@click="setColorHex(similar_color.color.hex)"
				:style="{ background: similar_color.color.hex }">
				<div>
					{{ similar_color.color.name }}
				</div>
				<span>
					{{ similar_color.key }}
				</span>
			</div>
		</div>
	</div>
</template>

<script>
import DillermNumerical from "@dillerm/webutils/src/components/controls/DillermNumerical.vue";
import DillermNavBar from "@dillerm/webutils/src/components/DillermNavBar.vue";
import { rgbToHex, rgbToHsl, hslToRgb, hexToRgb } from "@dillerm/webutils/src/utils.js";
import COLOR_WORDS from "/color_words.json";

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


function colorDist(c1, c2){
	var dist = 0;
	"hsl".split("").forEach(key => {
		dist += (c1[key] - c2[key])*(c1[key] - c2[key]);
	});
	return Math.sqrt(dist);
};

function getClosestColor(color, words) {
	var closest = null;
	var closest_dist = 0;
	words.forEach(color_word => {
		var dist = colorDist(color, color_word);
		if (closest == null || dist < closest_dist) {
			closest = color_word;
			closest_dist = dist;
		}
	});
	return closest;
}

function initColorLookupTable(words) {
	return Array.from(Object.keys(words).map(key => {
		var word_info = { name: key, hex: words[key] };
		Object.assign(word_info, hexToRgb(word_info.hex));
		Object.assign(word_info, rgbToHsl(word_info));
		return word_info;
	}));
}

var color_words_keys = Object.keys(COLOR_WORDS);
if (!Array.isArray(COLOR_WORDS[color_words_keys[0]])) {
	color_words_keys.forEach(key => {
		COLOR_WORDS[key] = initColorLookupTable(COLOR_WORDS[key]);
	})
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
				title: "Color Helper",
				github_url: "https://github.com/mdiller/color-helper"
			},
			color: {
				r: 18,
				g: 75,
				b: 125,
				h: 0,
				s: 0,
				l: 0,
				hex: ""
			},
			shown_color: {},
			similar_colors: [], // holds the key and color of the most similar colors
			slider_val: 55,
			handling_change: false,
			image: null,
			image_zoom: 1.0,
			originX: 0,
			originY: 0
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
		// zoomCanvas(zoom_amount) {
		// 	var canvas = this.$refs.canvas;
		// 	var ctx = canvas.getContext("2d");
		// 	ctx.imageSmoothingEnabled = false;
		// 	ctx.scale(zoom_amount, zoom_amount);
		// 	ctx.drawImage(this.image, 0, 0, this.image.naturalWidth, this.image.naturalHeight);
		// },
		drawCanvas() {
			const canvas = this.$refs.canvas;
			if (canvas == null) {
				return;
			}
			const ctx = canvas.getContext("2d");
			canvas.width = this.image.naturalWidth * this.image_zoom;
			canvas.height = this.image.naturalHeight * this.image_zoom;
			// ctx.setTransform(this.image_zoom, 0, 0, this.image_zoom, this.originX, this.originY);
			// ctx.clearRect(0, 0, canvas.width, canvas.height);
			// ctx.drawImage(this.image, 0, 0);
			ctx.imageSmoothingEnabled = false;
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.save();
			console.log("origins:", this.originX, this.originY);
			ctx.translate(0 - this.originX, 0 - this.originY);
			ctx.scale(this.image_zoom, this.image_zoom);
			ctx.drawImage(this.image, 0, 0);
		},
		zoomCanvas(event) {
			event.preventDefault();
			const canvas = this.$refs.canvas;
			const ctx = canvas.getContext("2d");
			const scaleAmount = 0.4;
			const mouseX = event.offsetX / this.image_zoom + this.originX / this.image_zoom;
			const mouseY = event.offsetY / this.image_zoom + this.originY / this.image_zoom;



			const old_zoom = this.image_zoom;
			
			console.log(event.offsetX / this.image_zoom, this.originX / this.image_zoom, mouseX);

			if (event.deltaY < 0) {
				this.image_zoom += scaleAmount;
			} else {
				if (this.image_zoom > 1.0) {
					this.image_zoom -= scaleAmount;
				}
				else {
					return;
				}
			}


			this.originX = mouseX * this.image_zoom - event.offsetX;
			this.originY = mouseY * this.image_zoom - event.offsetY;

			console.log(mouseX, event.offsetX, this.originX);

			this.drawCanvas();
		},
		loadImageFile(file) {
			var self = this;
			const reader = new FileReader();
			reader.readAsDataURL(file);
			var canvas = this.$refs.canvas;
			reader.addEventListener("load", function() {
				var img = new Image();
				img.onload = () => {
					self.image = img;
					self.drawCanvas();
				}
				img.src = this.result;
			});
		},
		uploadFile() {
			var file = this.$refs.file.files[0];
			if (!file) {
				return;
			}
			this.loadImageFile(file);
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
		},
		pasteHandler(event) {
			var text = (event.clipboardData || window.clipboardData).getData('text');
			var hex_pattern = /#?[0-9abcdef]{6}/i
			if (text && hex_pattern.test(text)) {
				if (!text[0] == "#") {
					text = "#" + text;
				}
				this.setColorHex(text);
			}
			else {
				var clip_data = (event.clipboardData || window.clipboardData);
				if (clip_data.items.length > 0 && clip_data.items[0].type == "image/png") {
					var file = clip_data.items[0].getAsFile();
					this.loadImageFile(file);
				}
			}
		}
	},
	computed: {
		rgb_text() {
			return `rgb(${this.color.r.toFixed()}, ${this.color.g.toFixed()}, ${this.color.b.toFixed()})`
		},
		hsl_text() {
			return `hsl(${this.color.h.toFixed()}, ${this.color.s.toFixed()}%, ${this.color.l.toFixed()}%)`
		}
	},
	watch: {
		shown_color: {
			handler() {
				this.similar_colors.forEach(similar_color => {
					similar_color.color = getClosestColor(this.shown_color, COLOR_WORDS[similar_color.key])
				});
			},	
			deep: true
		},
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
	created() {
		Object.keys(COLOR_WORDS).forEach(key => {
			this.similar_colors.push({
				key: key,
				color: COLOR_WORDS[key][0]
			});
		})

		document.removeEventListener('paste', this.pasteHandler);
		document.addEventListener('paste', this.pasteHandler);
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
	--animation-time: 0.15s;
}

#container {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
}

#container > div {
	flex: 1;
	padding: 10px 50px;
}

.combo-table > :first-child {
	grid-column: span 2;
	color: grey;
	padding: 10px;
	font-family: var(--input-numerical-font-family);
	background: var(--background-color3);
}

.combo-table { 
	display: grid;
    grid-template-columns: 40px auto; 
	background: var(--background-color2);
	border: 2px solid var(--background-color3);
	border-radius: 8px;
}

.combo-table > span {
	display: flex;
	justify-content: center;
	align-items: center;
}

.combo-table > div {
	border-radius: 0px;
}

@media screen and (max-width: 700px) {
	#container {
		display: flex;
		flex-direction: column;
	}

	#container > div {
		padding: 10px;
	}

	#container > div:nth-child(1) {
		order: 5;
	}
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
	color: transparent;
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
	border-radius: 8px;
	background: rgb(var(--color-r), var(--color-g), var(--color-b));
	width: 100%;
	height: 100px;
	border: 2px solid var(--background-color3);
	margin-bottom: 10px;
	transition: background var(--animation-time) linear;
}

#color-preview > div,
.color-panel > div {
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	padding: 8px;
	color: white;
	background: black;
	opacity: 50%;
	white-space: nowrap;
}

.color-panel > span {
	position: absolute;
	right: 0;
	top: 0;
	padding: 4px 4px 4px 6px;
	font-size: 10px;
	border-radius: 0px 0px 0px 8px;
	color: #aaaaaa;
	background: var(--background-color2);
	white-space: nowrap;
}

.color-panel {
	position: relative;
	border: 2px solid var(--background-color3);
	height: 100px;
	margin-bottom: 8px;
	cursor: pointer;
  	border-radius: 8px;
}

#pastedWrapper {
	overflow: auto;
	width: 100%;
	border: 2px solid var(--background-color3);
  	border-radius: 4px;
	background: var(--background-color3);
	max-height: 500px;
}

#pastedWrapper canvas {
	display: block;
	image-rendering: -webkit-optimize-contrast;
	image-rendering: -moz-crisp-edges;
}

</style>