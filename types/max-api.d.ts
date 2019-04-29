/**
 * Ref: https://docs.cycling74.com/nodeformax/api/module-max-api.html
 */
declare module "max-api" {
    /**
     * Built-in message types used for generic event handling
     *
     * @enum {number}
     */
    enum MESSAGE_TYPES {
        /**
         * Generic Type for *all* kinds of messages
         */
        ALL = "all",
        /**
         * Bang message type
         */
        BANG = "bang",
        /**
         * Dictionary message type
         */
        DICT = "dict",
        /**
         * Number message type
         */
        NUMBER = "number",
        /**
         * List message type
         */
        LIST = "list"
    }
    /**
     * Post/Log Levels
     *
     * @enum {number}
     */
    enum POST_LEVELS {
        /**
         * error level messages
         */
        ERROR = "error",
        /**
         * info level messages
         */
        INFO = "info",
        /**
         * warn
         */
        WARN = "warn"
    }

    type Anything = any;
    type Dict = { [key: string]: any };
    type DictIdentifier = string;
    type DictPath = string;
    type MessageHandler<K extends keyof MaxEventMap> = (...args: MaxEventMap[K]) => any;

    /**
     * Set a handler/callback function for the given message
     *
     * @template {keyof MaxEventMap} K
     * @param {K} msg - The message identifier to set the handler for
     * @param {MessageHandler<K>} listener - The message handler to add
     */
    function addHandler<K extends keyof MaxEventMap>(msg: K, listener: MessageHandler<K>): void;
    /**
     * Bulk register a set of handlers provided in an object fashion
     *
     * @param {{ [K in keyof MaxEventMap]?: MessageHandler<K> }} handlers - The handler objects
     */
    function addHandlers(handlers: { [K in keyof MaxEventMap]?: MessageHandler<K> }): void;
    /**
     * Access the contents of a dictionary in Max
     *
     * @param {DictIdentifier} id - The identifier of the dictionary
     * @returns {Promise<Dict>} - Return the dictionary if resolved or an Error if rejected
     */
    function getDict(id: DictIdentifier): Promise<Dict>;
    /**
     * Outlets the given value of the object's outlet in Max
     *
     * @param {...any[]} anything - The value to output
     * @returns {Promise<null>} - Returns null if resolved or an Error if rejected
     */
    function outlet(...anything: any[]): Promise<null>;
    /**
     * Sends a bang out of the object's outlet
     *
     * @returns {Promise<null>} - Returns null if resolved or an Error if rejected
     */
    function outletBang(): Promise<null>;
    /**
     * Print the given value to the Max console
     *
     * @param {...Anything[]} anything - The value to post
     * @param {POST_LEVELS} [level] - The log level of the post
     * @returns {Promise<null>}
     */
    function post(...anything: Anything[]): Promise<null>;
    /**
     * Remove a handler/callback function for the given message
     *
     * @template K {keyof MaxEventMap} K
     * @param {K} type - The message identifier to remove the handler for
     * @param {MessageHandler<K>} listener - The message handler to remove
     */
    function removeHandler<K extends keyof MaxEventMap>(type: K, listener: MessageHandler<K>): void;
    /**
     * Remove all inlet handlers for the given MessageIdentifier.
     * If no identifer is provided this function call
     * removes *all* inlet handlers for *all* messages
     *
     * @param {{ [K in keyof MaxEventMap]?: MessageHandler<K> }} [handlers]
     * - The message identifier to remove the handler for
     */
    function removeHandlers(handlers?: { [K in keyof MaxEventMap]?: MessageHandler<K> }): void;
    /**
     * Overrides the *entire* content of a dictionary in Max
     *
     * @param {DictIdentifier} id - The identifier of the dictionary
     * @param {Dict} content - The new content of the dictionary
     * @returns {Promise<Dict>} - Return the updated dictionary if resolved or an Error if rejected
     */
    function setDict(id: DictIdentifier, content: Dict): Promise<Dict>;
    /**
     * Updates the content of a dictionary in Max at the given path with the given value
     *
     * @param {DictIdentifier} id - The identifier of the dictionary
     * @param {DictPath} path - The path of the value change within the dictionary
     * @param {Anything} value - The value to set at this path
     * @returns {Promise<Dict>} - Return the updated dictionary if resolved or an Error if rejected
     */
    function updateDict(id: DictIdentifier, path: DictPath, value: Anything): Promise<Dict>;

    interface MaxEventMap {
        [MESSAGE_TYPES.ALL]: [string, ...any[]];
        [MESSAGE_TYPES.BANG]: [];
        [MESSAGE_TYPES.DICT]: [Dict];
        [MESSAGE_TYPES.NUMBER]: [number];
        [MESSAGE_TYPES.LIST]: (number | string)[];
        [key: string]: any[];
    }
}
