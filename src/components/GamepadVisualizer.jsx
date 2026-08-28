import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Gamepad2, Radio, Zap, Activity } from 'lucide-react';

export default function GamepadVisualizer() {
  const [hasPhysicalGamepad, setHasPhysicalGamepad] = useState(false);
  const [gamepadName, setGamepadName] = useState('Virtual Gamepad');
  
  // State data Gamepad yang meniru struct Bluepad32
  const [state, setState] = useState({
    axisX: 0,       // -511 .. 512
    axisY: 0,       // -511 .. 512
    axisRX: 0,      // -511 .. 512
    axisRY: 0,      // -511 .. 512
    brake: 0,       // 0 .. 1023 (L2)
    throttle: 0,    // 0 .. 1023 (R2)
    dpadUp: false,
    dpadDown: false,
    dpadLeft: false,
    dpadRight: false,
    btnA: false,    // Cross / A
    btnB: false,    // Circle / B
    btnX: false,    // Square / X
    btnY: false,    // Triangle / Y
    btnL1: false,
    btnR1: false,
    ledColor: '#00f2fe',
  });

  const animFrameRef = useRef(null);
  const leftStickRef = useRef(null);
  const rightStickRef = useRef(null);
  const draggingStick = useRef(null);

  // Polling Web Gamepad API untuk gamepad fisik jika tersambung
  const pollPhysicalGamepad = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.getGamepads) {
      const gamepads = navigator.getGamepads();
      const gp = Array.from(gamepads).find((g) => g !== null);

      if (gp) {
        setHasPhysicalGamepad(true);
        setGamepadName(gp.id.split('(')[0].trim() || 'Gamepad Terhubung');

        // Normalisasi ke rentang Bluepad32
        const rawLX = gp.axes[0] || 0;
        const rawLY = gp.axes[1] || 0;
        const rawRX = gp.axes[2] || 0;
        const rawRY = gp.axes[3] || 0;

        const brakeVal = gp.buttons[6] ? Math.round(gp.buttons[6].value * 1023) : 0;
        const throttleVal = gp.buttons[7] ? Math.round(gp.buttons[7].value * 1023) : 0;

        setState({
          axisX: Math.round(rawLX * 512),
          axisY: Math.round(rawLY * 512),
          axisRX: Math.round(rawRX * 512),
          axisRY: Math.round(rawRY * 512),
          brake: brakeVal,
          throttle: throttleVal,
          dpadUp: Boolean(gp.buttons[12]?.pressed),
          dpadDown: Boolean(gp.buttons[13]?.pressed),
          dpadLeft: Boolean(gp.buttons[14]?.pressed),
          dpadRight: Boolean(gp.buttons[15]?.pressed),
          btnA: Boolean(gp.buttons[0]?.pressed),
          btnB: Boolean(gp.buttons[1]?.pressed),
          btnX: Boolean(gp.buttons[2]?.pressed),
          btnY: Boolean(gp.buttons[3]?.pressed),
          btnL1: Boolean(gp.buttons[4]?.pressed),
          btnR1: Boolean(gp.buttons[5]?.pressed),
          ledColor: '#00f2fe',
        });
      } else {
        setHasPhysicalGamepad(false);
      }
    }
    animFrameRef.current = requestAnimationFrame(pollPhysicalGamepad);
  }, []);

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(pollPhysicalGamepad);
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [pollPhysicalGamepad]);

  // Handle Dragging Virtual Joystick
  const handleStickPointerDown = (stickName) => (e) => {
    if (hasPhysicalGamepad) return;
    draggingStick.current = stickName;
    handleStickPointerMove(e);
  };

  const handleStickPointerMove = (e) => {
    if (!draggingStick.current || hasPhysicalGamepad) return;
    const targetRef = draggingStick.current === 'left' ? leftStickRef.current : rightStickRef.current;
    if (!targetRef) return;

    const rect = targetRef.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = 32;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxRadius);
    const angle = Math.atan2(dy, dx);

    const normX = Math.round((Math.cos(angle) * (distance / maxRadius)) * 512);
    const normY = Math.round((Math.sin(angle) * (distance / maxRadius)) * 512);

    if (draggingStick.current === 'left') {
      setState((prev) => ({ ...prev, axisX: normX, axisY: normY }));
    } else {
      setState((prev) => ({ ...prev, axisRX: normX, axisRY: normY }));
    }
  };

  const handleStickPointerUp = () => {
    if (draggingStick.current && !hasPhysicalGamepad) {
      if (draggingStick.current === 'left') {
        setState((prev) => ({ ...prev, axisX: 0, axisY: 0 }));
      } else {
        setState((prev) => ({ ...prev, axisRX: 0, axisRY: 0 }));
      }
      draggingStick.current = null;
    }
  };

  useEffect(() => {
    const onMove = (e) => handleStickPointerMove(e);
    const onUp = () => handleStickPointerUp();
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [hasPhysicalGamepad]);

  // Hitung Bitmask Tombol (Sesuai konstanta Bluepad32)
  const buttonsBitmask =
    (state.btnA ? 0x0001 : 0) |
    (state.btnB ? 0x0002 : 0) |
    (state.btnX ? 0x0004 : 0) |
    (state.btnY ? 0x0008 : 0) |
    (state.btnL1 ? 0x0010 : 0) |
    (state.btnR1 ? 0x0020 : 0);

  return (
    <div className="visualizer-card">
      <div className="visualizer-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="logo-icon-box" style={{ width: 36, height: 36 }}>
            <Gamepad2 size={20} />
          </div>
          <div>
            <h4 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Bluepad32 Interactive Gamepad Tester
            </h4>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {hasPhysicalGamepad
                ? 'Gamepad fisik terdeteksi via Web Gamepad API!'
                : 'Geser stik / klik tombol di bawah untuk simulasi'}
            </span>
          </div>
        </div>

        <div
          className={`controller-status ${
            hasPhysicalGamepad ? 'status-connected' : 'status-disconnected'
          }`}
        >
          <Radio size={14} className={hasPhysicalGamepad ? 'animate-pulse' : ''} />
          <span>{hasPhysicalGamepad ? gamepadName : 'Virtual Simulation Mode'}</span>
        </div>
      </div>

      <div className="gamepad-container">
        {/* Virtual Gamepad UI */}
        <div className="virtual-gamepad">
          {/* Triggers (L2 / R2) */}
          <div className="gamepad-top-triggers">
            <div className="trigger-indicator">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span>L2 / Brake</span>
                <strong style={{ color: 'var(--primary)' }}>{state.brake}</strong>
              </div>
              <div
                className="trigger-bar"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  !hasPhysicalGamepad &&
                  setState((p) => ({ ...p, brake: p.brake > 0 ? 0 : 1023 }))
                }
              >
                <div
                  className="trigger-fill"
                  style={{ width: `${(state.brake / 1023) * 100}%` }}
                />
              </div>
            </div>

            <div className="trigger-indicator">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                <span>R2 / Throttle</span>
                <strong style={{ color: 'var(--accent)' }}>{state.throttle}</strong>
              </div>
              <div
                className="trigger-bar"
                style={{ cursor: 'pointer' }}
                onClick={() =>
                  !hasPhysicalGamepad &&
                  setState((p) => ({ ...p, throttle: p.throttle > 0 ? 0 : 1023 }))
                }
              >
                <div
                  className="trigger-fill"
                  style={{
                    width: `${(state.throttle / 1023) * 100}%`,
                    background: 'var(--accent)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* D-Pad & Action Buttons */}
          <div className="gamepad-middle-section">
            {/* D-PAD */}
            <div className="dpad-cross">
              <div />
              <button
                className={`dpad-btn ${state.dpadUp ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadUp: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadUp: false }))}
              >
                ▲
              </button>
              <div />
              <button
                className={`dpad-btn ${state.dpadLeft ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadLeft: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadLeft: false }))}
              >
                ◀
              </button>
              <div className="dpad-btn" style={{ background: 'transparent', border: 'none' }} />
              <button
                className={`dpad-btn ${state.dpadRight ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadRight: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadRight: false }))}
              >
                ▶
              </button>
              <div />
              <button
                className={`dpad-btn ${state.dpadDown ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadDown: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, dpadDown: false }))}
              >
                ▼
              </button>
              <div />
            </div>

            {/* LED Status Bar */}
            <div
              style={{
                width: '36px',
                height: '8px',
                borderRadius: '4px',
                backgroundColor: state.ledColor,
                boxShadow: `0 0 12px ${state.ledColor}`,
              }}
              title="Gamepad RGB Lightbar"
            />

            {/* Action Buttons (A, B, X, Y) */}
            <div className="action-buttons">
              <div />
              <button
                className={`action-btn ${state.btnY ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnY: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnY: false }))}
              >
                Y
              </button>
              <div />
              <button
                className={`action-btn ${state.btnX ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnX: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnX: false }))}
              >
                X
              </button>
              <div />
              <button
                className={`action-btn ${state.btnB ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnB: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnB: false }))}
              >
                B
              </button>
              <div />
              <button
                className={`action-btn ${state.btnA ? 'active' : ''}`}
                onMouseDown={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnA: true }))}
                onMouseUp={() => !hasPhysicalGamepad && setState((p) => ({ ...p, btnA: false }))}
              >
                A
              </button>
              <div />
            </div>
          </div>

          {/* Dual Analog Joysticks */}
          <div className="joysticks-container">
            {/* Left Stick */}
            <div style={{ textAlign: 'center' }}>
              <div
                className="joystick-well"
                ref={leftStickRef}
                onPointerDown={handleStickPointerDown('left')}
              >
                <div
                  className="joystick-stick"
                  style={{
                    transform: `translate(${(state.axisX / 512) * 24}px, ${(state.axisY / 512) * 24}px)`,
                  }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                Left Stick (Steering / Move)
              </span>
            </div>

            {/* Right Stick */}
            <div style={{ textAlign: 'center' }}>
              <div
                className="joystick-well"
                ref={rightStickRef}
                onPointerDown={handleStickPointerDown('right')}
              >
                <div
                  className="joystick-stick"
                  style={{
                    background: 'radial-gradient(circle at 35% 35%, #a855f7, #7e22ce)',
                    transform: `translate(${(state.axisRX / 512) * 24}px, ${(state.axisRY / 512) * 24}px)`,
                  }}
                />
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
                Right Stick (Camera / Pan)
              </span>
            </div>
          </div>
        </div>

        {/* Telemetry Output Data Panel (ESP32 Bluepad32 Data Structure) */}
        <div className="telemetry-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 700 }}>
            <Activity size={16} />
            <span>Bluepad32 C++ Telemetry Output</span>
          </div>

          <div className="telemetry-row">
            <span>gp-&gt;axisX() (Left X):</span>
            <span className="telemetry-val">{state.axisX}</span>
          </div>
          <div className="telemetry-row">
            <span>gp-&gt;axisY() (Left Y):</span>
            <span className="telemetry-val">{state.axisY}</span>
          </div>
          <div className="telemetry-row">
            <span>gp-&gt;axisRX() (Right X):</span>
            <span className="telemetry-val">{state.axisRX}</span>
          </div>
          <div className="telemetry-row">
            <span>gp-&gt;axisRY() (Right Y):</span>
            <span className="telemetry-val">{state.axisRY}</span>
          </div>
          <div className="telemetry-row">
            <span>gp-&gt;brake() (L2 10-bit):</span>
            <span className="telemetry-val">{state.brake}</span>
          </div>
          <div className="telemetry-row">
            <span>gp-&gt;throttle() (R2 10-bit):</span>
            <span className="telemetry-val">{state.throttle}</span>
          </div>
          <div className="telemetry-row">
            <span>gp-&gt;buttons() Bitmask:</span>
            <span className="telemetry-val">0x{buttonsBitmask.toString(16).toUpperCase().padStart(4, '0')}</span>
          </div>
          <div className="telemetry-row" style={{ borderBottom: 'none' }}>
            <span>DPAD Bitmask:</span>
            <span className="telemetry-val">
              {state.dpadUp ? 'UP ' : ''}
              {state.dpadDown ? 'DOWN ' : ''}
              {state.dpadLeft ? 'LEFT ' : ''}
              {state.dpadRight ? 'RIGHT ' : ''}
              {!state.dpadUp && !state.dpadDown && !state.dpadLeft && !state.dpadRight ? 'NONE (0x00)' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
