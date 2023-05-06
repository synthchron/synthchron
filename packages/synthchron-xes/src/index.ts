import { deserialize } from './transformer'

// Todo: remove this at some point but keep for now as an example.
export const main = (): string => 'Hello World'

export { serialize, deserialize } from './transformer'

export type { XESLog, XESTrace, XESEvent, XESAttribute } from './types'

/* deserialize(`
<log>
    <trace>
    </trace>
    <trace/>
    <trace>
      <event>
            <string key="concept:name" value="A"/>
        </event>
        <event>
            <string key="concept:name" value="A"/>
        </event>
        <event>
            <string key="concept:name" value="A"/>
        </event>
        <event>
            <string key="concept:name" value="A"/>
        </event>
    </trace>
</log>
`)
 */
deserialize(`<log>
  <trace>
    <event>
      <string name="Event 1"/>
    </event>
    <event>
      <string name="Event 2"/>
    </event>
  </trace>
  <trace>
    <event>
      <string name="Event 3"/>
    </event>
  </trace>
</log>`)
