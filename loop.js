export default function loop(fn) {
    window.requestAnimationFrame(loop.bind(null, fn));
    fn();
}