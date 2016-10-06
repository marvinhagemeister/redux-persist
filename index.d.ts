declare namespace ReduxPersist {
  type Storage = any;

  interface Object {
    [key: string]: any;
  }

  export interface Config {
    storage?: Storage;
    keyPrefix?: string;
  }

  export interface PersistConfig {
    skipRestore?: boolean;
  }

  export interface TransformConfig {
    whitelist?: string[];
    blacklist?: string[];
  }

  /**
   * @class ReadConfig
   */
  export interface ReadConfig implements Config, TransformConfig {
    transforms?: Transformer[];

    /**
     * Deserialize the stored state
     * @param {string} serial Stored state string
     * @return {Object} redux state tree
     */
    deserialize?(serial: string): Object;
  }

  export interface PersistorConfig implements ReadConfig {
    debounce?: number;

    /**
     * Serialize the redux state tree
     * @param {Object} state Redux state tree
     * @return {string}
     */
    serialize?(state: Object): string;
  }

  interface AutoRehydrateConfig {
    stateReconciler(state: any, inboundState, reducedState, log): Object;
  }

  export interface Transformer {
    /**
     * @param {Object} state Redux state tree
     * @param {string} key Reducer name
     * @return {Object}
     */
    in(state: any, key: string): any;

    /**
     * @param {Object} state Redux state tree
     * @param {string} key Reducer name
     * @return {Object}
     */
    out(state: any, key: string): any;
  }

  /**
   * @class Persistor
   */
  export interface Persistor {
    rehydrate(): void;
    pause(): void;
    resume(): void;

    /**
     * Remove all specified fields from persistor
     * @param {string[]} keys Keys to remove
     */
    purge(keys: string[]): void;
  }

  export function autoRehydrate(config: AutoRehydrateConfig): (next) => (reducer, initialState, enhancer) => ;

  /**
   * Create a persistor backend
   * @param {Object} store Redux store
   * @param {PersistorConfig} config
   * @return {Persistor}
   */
  export function createPersistor(store: any, config: PersistorConfig): Persistor;

  /**
   * Transform the state when persisting or rehydrating the redux store.
   * @param {Function} inbound
   * @param {Function} outbound
   * @param {Object} config
   */
  export function createTransform(inbound: (state: any, key: string) => any, outbound: (state: any, key: string) => any, config: TransformConfig): Transformer;

  /**
   * Load the stored state
   * @param {ReadConfig} config
   * @param {Function} onComplete Callback with teh restored state
   * @return {Object} Restored Redux state object
   */
  export function getStoredState(config: ReadConfig, onComplete: (err: Error, restoredState: any) => any): Object;

  /**
   * Save redux store into the specified backend
   * @param {} store
   * @param {PersistConfig} config
   * @param {Function} onComplete
   * @return {Persistor}
   */
  export function persistStore(store, config: PersistConfig, onComplete: (err: Error, restoredState: any) => any): Whatever;

  /**
   * Remove specified keys from storage
   * @param {Config} config Storage configuration config
   * @param {string[]} keys Keys to purge
   */
  export function purgeStoredState(config, keys);

  export storages;
}

declare module "redux-persist" {
  export = ReduxPersist;
}
