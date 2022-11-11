<template>
	<div class="color-cube-container">
		<div
			:style="{ transform: cube_transform }"
			class="color-cube">
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

const ORIGIN_MATRIX = {
	x: [ -1,  1, -2 ],
	y: [ -1, -1,  4 ],
	z: [  1,  4, -3 ]
}

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
	computed: {
		// cube_transform_old() {
		// 	var total = 255;
		// 	var vals = {
		// 		x: this.x / total,
		// 		y: this.y / total,
		// 		z: this.z / total
		// 	}
		// 	var matrix = {
		// 		x: ORIGIN_MATRIX.x.map(v => v * vals.x),
		// 		y: ORIGIN_MATRIX.y.map(v => v * vals.y),
		// 		z: ORIGIN_MATRIX.z.map(v => v * vals.z)
		// 	}

		// 	var result = {}
		// 	"xyz".split("").forEach((axis, index) => {
		// 		var steps = matrix.x[index] * matrix.y[index] * matrix.z[index];
		// 		result[axis] = `${steps * 45}deg`;
		// 	})

		// 	var result = `translateZ(-100px) rotateX(${result.x}) rotateY(${result.y}) rotateZ(${result.z})`;
		// 	console.log(result);
		// 	return result;
		// }
		cube_transform() {
			// transform: translateZ(-100px) rotateX(63deg) rotateY(-45deg) rotateZ(270deg) rotate3d(1, 1, 1, calc(60 * var(--cube-rotate-x) / 45)) rotateY(-90deg);
			var transforms = [];
			transforms.push(`translateZ(-100px)`);
			console.log("hi")

			var x_rotation = (-35 - (this.l * 180)).toFixed();
			transforms.push(`rotateX(${x_rotation}deg)`);
			transforms.push(`rotateY(-45deg)`);
			transforms.push(`rotateZ(270deg)`);
			
			var hue = -60;
			transforms.push(`rotate3d(1, 1, 1, ${hue}%)`);

			transforms.push(`rotateY(-90deg)`)

			return transforms.join(" ");
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
	/* transform: translateZ(-100px) rotateX(-35deg) rotateY(-45deg) rotateZ(270deg) rotate3d(1, 1, 1, calc(60 * var(--cube-rotate-x) / 45)) rotateY(-90deg); */
	/* transform: translateZ(-100px) rotateX(var(--cube-rotate-x)) rotateY(var(--cube-rotate-y)) rotateZ(var(--cube-rotate-z)); */
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

/* 
.cube__face--front  { background: red; }
.cube__face--right  { background: green; }
.cube__face--left   { background: teal; }
.cube__face--top    { background: blue; }
.cube__face--bottom { background: purple; } */

/* 
.cube__face--back  {
	opacity: 1;
	background:
		linear-gradient(to right, rgb(0, 0, 255) 0, rgb(255, 0, 255) 100%),
		linear-gradient(rgb(0, 0, 255) 0, rgb(0, 255, 255) 100%);
	background-blend-mode: screen;

} */


.cube__face--front  { transform: rotateY(  0deg); }
.cube__face--right  { transform: rotateY( 90deg); }
.cube__face--back   { transform: rotateY(180deg); }
.cube__face--left   { transform: rotateY(-90deg); }
.cube__face--top    { transform: rotateX( 90deg); }
.cube__face--bottom { transform: rotateX(-90deg); }

.cube__face--front  { transform: rotateY(  0deg) translateZ(100px); }
.cube__face--right  { transform: rotateY( 90deg) translateZ(100px); }
.cube__face--back   { transform: rotateY(180deg) translateZ(100px); }
.cube__face--left   { transform: rotateY(-90deg) translateZ(100px); }
.cube__face--top    { transform: rotateX( 90deg) translateZ(100px); }
.cube__face--bottom { transform: rotateX(-90deg) translateZ(100px); }


</style>