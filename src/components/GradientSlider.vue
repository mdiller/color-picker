<template>
	<dillerm-slider 
		@input="console.log('hi')"
		v-bind="$attrs"
	/>
</template>

<script>
import DillermSlider from "@dillerm/webutils/src/components/controls/DillermSlider.vue";

export default {
	name: 'gradient-slider',
	props: {
		color_template: {
			type: String,
			required: true
		},
		color_nodes: {
			type: Number,
			required: false,
			default: 2
		}
	},
	components: {
		DillermSlider
	},
	methods: {
		applyColors() {
			var gradient_nodes = [];
			for (let i = 0; i < this.color_nodes; i++) {
				var value = ((i / (this.color_nodes - 1)) * (this.$attrs.max - this.$attrs.min)) + this.$attrs.min;
				gradient_nodes.push(this.color_template.replace("{value}", value.toFixed()))
			}
			this.$el.style.setProperty("--gradient-start", gradient_nodes[0]);
			this.$el.style.setProperty("--gradient-end", gradient_nodes[gradient_nodes.length - 1]);
			this.$el.style.setProperty("--gradient-full", `linear-gradient(to right, ${gradient_nodes.join(", ")})`);
		}
	},
	mounted() {
		this.applyColors();
	}
};


</script>

<style>

.slider-bar-left {
	opacity: 0 !important;
}

.slider-bar-back {
	background: var(--gradient-full);
}

.slider-bar-prefix {
	opacity: 1 !important;
	background: var(--gradient-start) !important;
}

.slider-bar-postfix {
	background: var(--gradient-end) !important;
}

</style>