export default function bufferConcat(...bufs) {
    const sizes = bufs.map((buf) => {
        return buf.length;
    });
    let total = sizes.reduce((pre, crt) => {
        return pre + crt;
    });

    return Buffer.concat(bufs, total);
}