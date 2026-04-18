import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { type RedisOptions } from 'ioredis';

import { BaseRedis } from '../core';

import { RedisSubscriberChannelHandler, RedisSubscriberJsonHandler } from './types';

@Injectable()
export class RedisSubscriber extends BaseRedis implements OnModuleDestroy {
  private readonly channelHandlers = new Map<string, Set<RedisSubscriberChannelHandler>>();
  private readonly patternHandlers = new Map<string, Set<RedisSubscriberChannelHandler>>();

  private messageListenerBound = false;
  private pmessageListenerBound = false;

  constructor(options: RedisOptions) {
    super(RedisSubscriber.name, options);
  }

  private ensureMessageListener() {
    if (this.messageListenerBound) {
      return;
    }

    this.messageListenerBound = true;
    this.on('message', (channel, message) => {
      const handlers = this.channelHandlers.get(channel);
      if (!handlers || handlers.size === 0) return;

      for (const handler of handlers) {
        try {
          handler(message, channel);
        } catch (e) {
          this.logger.error(`handler error (channel=${channel})`, e);
        }
      }
    });
  }

  private ensurePMessageListener() {
    if (this.pmessageListenerBound) {
      return;
    }

    this.pmessageListenerBound = true;
    this.on('pmessage', (pattern, channel, message) => {
      const handlers = this.patternHandlers.get(pattern);

      if (!handlers || handlers.size === 0) {
        return;
      }

      for (const handler of handlers) {
        try {
          handler(message, channel);
        } catch (e) {
          this.logger.error(`handler error (pattern=${pattern}, channel=${channel})`, e);
        }
      }
    });
  }

  async subscribeChannel(channel: string, handler: RedisSubscriberChannelHandler) {
    this.ensureMessageListener();

    const handlers = this.channelHandlers.get(channel) ?? new Set<RedisSubscriberChannelHandler>();

    if (handlers.size === 0) {
      await super.subscribe(channel);
      this.logger.debug(`subscribed channel: ${channel}`);
    }

    handlers.add(handler);
    this.channelHandlers.set(channel, handlers);

    return async () => this.unsubscribeChannel(channel, handler);
  }

  async subscribeJSON<T = unknown>(channel: string, handler: RedisSubscriberJsonHandler<T>) {
    return this.subscribeChannel(channel, (message, ch) => {
      try {
        handler(JSON.parse(message) as T, ch);
      } catch (e) {
        this.logger.error(`Invalid JSON message from ${ch}`, e);
      }
    });
  }

  private async unsubscribeChannel(channel: string, handler: RedisSubscriberChannelHandler) {
    const handlers = this.channelHandlers.get(channel);

    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    if (handlers.size === 0) {
      this.channelHandlers.delete(channel);
      await super.unsubscribe(channel);
      this.logger.debug(`unsubscribed channel: ${channel}`);
    }
  }

  async subscribePattern(pattern: string, handler: RedisSubscriberChannelHandler) {
    this.ensurePMessageListener();

    const handlers = this.patternHandlers.get(pattern) ?? new Set<RedisSubscriberChannelHandler>();
    if (handlers.size === 0) {
      await super.psubscribe(pattern);
      this.logger.debug(`psubscribed pattern: ${pattern}`);
    }

    handlers.add(handler);
    this.patternHandlers.set(pattern, handlers);

    return async () => this.unsubscribePattern(pattern, handler);
  }

  async subscribePatternJSON<T = unknown>(pattern: string, handler: RedisSubscriberJsonHandler<T>) {
    return this.subscribePattern(pattern, (message, channel) => {
      try {
        handler(JSON.parse(message) as T, channel);
      } catch (e) {
        this.logger.error(`Invalid JSON message from ${channel}`, e);
      }
    });
  }

  private async unsubscribePattern(pattern: string, handler: RedisSubscriberChannelHandler) {
    const handlers = this.patternHandlers.get(pattern);

    if (!handlers) {
      return;
    }

    handlers.delete(handler);

    if (handlers.size === 0) {
      this.patternHandlers.delete(pattern);
      await super.punsubscribe(pattern);
      this.logger.debug(`punsubscribed pattern: ${pattern}`);
    }
  }

  async onModuleDestroy() {
    await this.quit();
  }
}
