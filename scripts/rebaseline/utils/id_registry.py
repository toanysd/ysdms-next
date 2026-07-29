import json
from pathlib import Path
from typing import Optional, Dict

class IdRegistry:
    """Registry for mapping legacy keys to UUIDs."""
    def __init__(self):
        self._registry: Dict[str, Dict[str, str]] = {}

    def register(self, namespace: str, legacy_key: str, uuid: str) -> None:
        """Store mapping for a legacy key."""
        if namespace not in self._registry:
            self._registry[namespace] = {}
        self._registry[namespace][str(legacy_key)] = str(uuid)

    def lookup(self, namespace: str, legacy_key: str) -> Optional[str]:
        """Get UUID by legacy key."""
        return self._registry.get(namespace, {}).get(str(legacy_key))

    def get_all(self, namespace: str) -> Dict[str, str]:
        """Get all mappings for namespace."""
        return self._registry.get(namespace, {})

    def save(self, filepath: Path) -> None:
        """Save all registries to JSON."""
        filepath.parent.mkdir(parents=True, exist_ok=True)
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(self._registry, f, indent=2, ensure_ascii=False)

    def load(self, filepath: Path) -> None:
        """Load registries from JSON."""
        if filepath.exists():
            with open(filepath, 'r', encoding='utf-8') as f:
                self._registry = json.load(f)

    def stats(self) -> Dict[str, int]:
        """Return count per namespace."""
        return {ns: len(keys) for ns, keys in self._registry.items()}
