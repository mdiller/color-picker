<template>
	<div class="color-cube-container">
		<div class="color-cube">
			<div class="cube__face cube__face--front"
				:style="{ background: getCubeFaceGradient(
						{x: 0, y: 0, z: 0},
						{x: 1, y: 1, z: 0}) 
						}"></div>
			<div class="cube__face cube__face--back"
				:style="{ background: getCubeFaceGradient(
						{x: 1, y: 0, z: 1},
						{x: 0, y: 1, z: 1}) 
						}"></div>
			<div class="cube__face cube__face--right"
				:style="{ background: getCubeFaceGradient(
						{x: 1, y: 0, z: 0},
						{x: 1, y: 1, z: 1}) 
						}"></div>
			<div class="cube__face cube__face--left"
				:style="{ background: getCubeFaceGradient(
						{x: 0, y: 0, z: 1},
						{x: 0, y: 1, z: 0}) 
						}"></div>
			<div class="cube__face cube__face--top"
				:style="{ background: getCubeFaceGradient(
						{x: 0, y: 0, z: 1},
						{x: 1, y: 0, z: 0}) 
						}"></div>
			<div class="cube__face cube__face--bottom"
				:style="{ background: getCubeFaceGradient(
						{x: 0, y: 1, z: 0},
						{x: 1, y: 1, z: 1}) 
						}"></div>
		</div>
	</div>
</template>

<script>

export default {
	name: 'color-cube',
	props: {
		h: {
			type: Number,
			required: true
		},
		s: {
			type: Number,
			required: true
		},
		l: {
			type: Number,
			required: true
		}
	},
	methods: {
		getGradient(x, y, z) {
			x *= 255;
			y *= 255;
			z *= 255;
			return `rgb(${x}, ${y}, ${z})`;
		},
		getCubeFaceGradient(top_left, bottom_right) {
			var masks = {
				x: top_left.x == bottom_right.x ? top_left.x : 0,
				y: top_left.y == bottom_right.y ? top_left.y : 0,
				z: top_left.z == bottom_right.z ? top_left.z : 0
			}

			var gradients = {
				x: [ this.getGradient(top_left.x, masks.y, masks.z), this.getGradient(bottom_right.x, masks.y, masks.z) ],
				y: [ this.getGradient(masks.x, top_left.y, masks.z), this.getGradient(masks.x, bottom_right.y, masks.z) ],
				z: [ this.getGradient(masks.x, masks.y, top_left.z), this.getGradient(masks.x, masks.y, bottom_right.z) ]
			}

			var final_gradients = [];
			var final_gradients = "xyz".split("")
				.filter(axis => top_left[axis] != bottom_right[axis])
				.map(axis => gradients[axis]);


			// if this is true, swap the position of the gradients
			var swap_order = top_left.x == bottom_right.x;

			if (swap_order) {
				final_gradients.reverse();
			}
			
			return `linear-gradient(to right, ${final_gradients[0][0]} 0%, ${final_gradients[0][1]} 100%), linear-gradient(${final_gradients[1][0]} 0%, ${final_gradients[1][1]} 100%)`;
		}
	},
	mounted() {
	}
};


</script>

<style>

/* this css based on https://3dtransforms.desandro.com/cube */

.color-cube-container {
	margin: 65px auto;
	width: 200px;
	height: 200px;
	perspective: 600px;
}

.color-cube {
	width: 100%;
	height: 100%;
	position: relative;
	transform-style: preserve-3d;
	transform:
		translateZ(-100px)
		rotateX(calc(145deg - (var(--color-l-decimal) * 180deg)))
		rotateY(-45deg) rotateZ(270deg)
		rotate3d(1, 1, 1, calc((var(--color-h) * 1deg) - 60deg))
		rotateY(-90deg);
	/* transition: transform 0.5s; */
}

.cube__face {
	position: absolute;
	width: 200px;
	height: 200px;
	opacity: 1;
	border: 1px solid black;
	background-blend-mode: screen;
}

.cube__face--front  { transform: rotateY(  0deg) translateZ(100px); }
.cube__face--right  { transform: rotateY( 90deg) translateZ(100px); }
.cube__face--back   { transform: rotateY(180deg) translateZ(100px); }
.cube__face--left   { transform: rotateY(-90deg) translateZ(100px); }
.cube__face--top    { transform: rotateX( 90deg) translateZ(100px); }
.cube__face--bottom { transform: rotateX(-90deg) translateZ(100px); }


</style>