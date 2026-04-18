export type RedisSubscriberChannelHandler = (message: string, channel: string) => void;
export type RedisSubscriberJsonHandler<T> = (message: T, channel: string) => void;
