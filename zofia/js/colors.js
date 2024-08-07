export function blend(color1, color2, percentage = 0.5) {
    if (percentage > 1 || percentage < 0)
        throw new error("percentage must be between 0 and 1");

    color1 = colorParts(color1);
    color2 = colorParts(color2);

    var color3 = [
        (1 - percentage) * color1[0] + percentage * color2[0],
        (1 - percentage) * color1[1] + percentage * color2[1],
        (1 - percentage) * color1[2] + percentage * color2[2],
    ];

    color3 = "#" + padHex(color3[0]) + padHex(color3[1]) + padHex(color3[2]);

    return color3;
}

export function padHex(num) {
    var hex = Math.round(num).toString(16);
    if (hex.length == 1) hex = "0" + hex;
    return hex;
}

export function colorParts(hex) {
    hex = hex.replace("#", "");
    if (hex.length != 3 && hex.length != 6)
        throw new error("colors must be provided as hexes");
    if (hex.length == 3)
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];

    return [
        parseInt(hex[0] + hex[1], 16),
        parseInt(hex[2] + hex[3], 16),
        parseInt(hex[4] + hex[5], 16),
    ];
}

export function invert(hex) {
    hex = colorParts(hex);
    return (
        "#" + padHex(255 - hex[0]) + padHex(255 - hex[1]) + padHex(255 - hex[2])
    );
}
