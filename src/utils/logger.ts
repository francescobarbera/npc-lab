export default class Logger {
    private static colors = [
        "\x1b[31m", // red
        "\x1b[32m", // green
        "\x1b[33m", // yellow
        "\x1b[34m", // blue
        "\x1b[35m", // magenta
        "\x1b[36m", // cyan
    ];
    private static usedColorIndexes = new Set<number>();
    private color: string;
    private reset = "\x1b[0m";

    constructor(private scope: string) {
        const availableIndexes = Logger.colors
            .map((_, idx) => idx)
            .filter((idx) => !Logger.usedColorIndexes.has(idx));
        if (availableIndexes.length === 0) {
            // All colors used, fallback to random or reuse
            this.color =
                Logger.colors[Math.floor(Math.random() * Logger.colors.length)];
        } else {
            const idx =
                availableIndexes[
                    Math.floor(Math.random() * availableIndexes.length)
                ];
            Logger.usedColorIndexes.add(idx);
            this.color = Logger.colors[idx];
        }
    }

    public info(message: string) {
        console.log(`${this.color}INFO: ${this.scope} - ${this.reset} ${message}`);
    }
}
