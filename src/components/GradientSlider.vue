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
		color1: {
			type: String,
			required: true
		},
		color2: {
			type: String,
			required: true
		}
	},
	components: {
		DillermSlider
	},
	methods: {
		applyColors() {
			this.$el.style.setProperty("--gradient-color1", this.color1);
			this.$el.style.setProperty("--gradient-color2", this.color2);
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
	background: linear-gradient(to right, var(--gradient-color1), var(--gradient-color2));
}

.slider-bar-prefix {
	opacity: 1 !important;
	background: var(--gradient-color1) !important;
}

.slider-bar-postfix {
	background: var(--gradient-color2) !important;
}

</style>