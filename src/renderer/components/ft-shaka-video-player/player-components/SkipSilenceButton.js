import shaka from 'shaka-player'

import i18n from '../../../i18n/index'
import { PlayerIcons } from '../../../../constants'

export class SkipSilenceButton extends shaka.ui.Element {
  /**
   * @param {boolean} skipSilenceEnabled
   * @param {EventTarget} events
   * @param {HTMLElement} parent
   * @param {shaka.ui.Controls} controls
   */
  constructor(skipSilenceEnabled, events, parent, controls) {
    super(parent, controls)

    /** @private */
    this.button_ = document.createElement('button')
    this.button_.classList.add('skip-silence-button', 'shaka-tooltip')

    /**
     * Animated audio-level bar rendered as the button's background fill.
     * @private
     */
    this.levelBar_ = document.createElement('div')
    this.levelBar_.classList.add('skip-silence-level-bar')
    this.button_.appendChild(this.levelBar_)

    /** @private */
    this.icon_ = new shaka.ui.Icon(this.button_, PlayerIcons.TIMER_DEFAULT)

    const label = document.createElement('label')
    label.classList.add(
      'shaka-overflow-button-label',
      'shaka-overflow-menu-only',
      'shaka-simple-overflow-button-label-inline'
    )

    /** @private */
    this.nameSpan_ = document.createElement('span')
    label.appendChild(this.nameSpan_)

    /** @private */
    this.currentState_ = document.createElement('span')
    this.currentState_.classList.add('shaka-current-selection-span')
    label.appendChild(this.currentState_)

    this.button_.appendChild(label)

    this.parent.appendChild(this.button_)

    /** @private */
    this.skipSilenceEnabled_ = skipSilenceEnabled

    // listeners

    this.eventManager.listen(this.button_, 'click', () => {
      events.dispatchEvent(new CustomEvent('toggleSkipSilence', {
        detail: 'click'
      }))
      this.skipSilenceEnabled_ = !this.skipSilenceEnabled_
      this.updateLocalisedStrings_()
    })

    this.eventManager.listen(events, 'setSkipSilence', (event) => {
      this.skipSilenceEnabled_ = event.detail
      this.updateLocalisedStrings_()
    })

    this.eventManager.listen(events, 'silenceSkipAudioLevel', (event) => {
      this.levelBar_.style.width = (Math.min(event.detail, 1) * 100).toFixed(1) + '%'
    })

    this.eventManager.listen(events, 'localeChanged', () => {
      this.updateLocalisedStrings_()
    })

    this.updateLocalisedStrings_()
  }

  /** @private */
  updateLocalisedStrings_() {
    this.nameSpan_.textContent = this.button_.ariaLabel = i18n.global.t('Video.Player.Skip Silence')
    this.icon_.use(this.skipSilenceEnabled_ ? PlayerIcons.SHUTTER_SPEED_DEFAULT : PlayerIcons.TIMER_DEFAULT)
    this.currentState_.textContent = this.localization.resolve(this.skipSilenceEnabled_ ? 'ON' : 'OFF')
  }
}
