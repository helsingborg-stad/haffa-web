import { useState } from 'react'

const USED_KEYS_KEY = 'haffa_ls_key_usage'

const tryGetLsItem = <T>(key: string, defaultValue: T): T => {
    try {
        // Get from local storage by key
        const item = window.localStorage.getItem(key)
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : defaultValue
    } catch (error) {
        // If error also return initialValue
        console.log(error)
        return defaultValue
    }
}

const trySetLsItem = <T>(key: string, value: T): void => {
    window.localStorage.setItem(key, JSON.stringify(value))
}

const registerKeyUsage = (key: string): void => {
    const usedKeys = tryGetLsItem<string[]>(USED_KEYS_KEY, [])
    if (!Array.isArray(usedKeys)) {
        return trySetLsItem(USED_KEYS_KEY, [key])
    }
    if (!usedKeys.includes(key)) {
        trySetLsItem(USED_KEYS_KEY, [...usedKeys, key])
    }
}

/** React hook for localStorage
 * From https://usehooks.com/useLocalStorage/
 */
export default function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (x: T) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState(() =>
        tryGetLsItem(key, initialValue)
    )

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T): void => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value
            // Save state
            setStoredValue(valueToStore)
            // Save to local storage
            trySetLsItem(key, valueToStore)

            registerKeyUsage(key)
        } catch (error) {
            // A more advanced implementation would handle the error case
            console.log(error)
        }
    }

    return [storedValue, setValue]
}
